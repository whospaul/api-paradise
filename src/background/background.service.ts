import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DeleteDto,
  ForceDto,
  GetDto,
  UpdateDto,
  UrlDto,
} from './dto/background.dto';
import { AuthService } from '../auth/auth.service';
import { Queue } from './background.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable({})
export class BackgroundService {
  private readonly logger = new Logger(BackgroundService.name);
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async url(dto: UrlDto, token: string) {
    await this.authService.validateToken(token);

    if (dto.image_url.includes('unsplash' || 'pexels'))
      if (dto.image_url.includes('image.' || 'images.'))
        throw new BadRequestException('Invalid image url');

    this.logger.log({ dto });
    const queue = this.queueRepository.create({ ...dto });
    const savedQueue = await this.queueRepository.save(queue);
    return savedQueue;
  }

  async force(dto: ForceDto, token: string) {
    await this.authService.validateToken(token);

    const queue = this.queueRepository.findOne({ where: { id: dto.id } });
    if (!queue) throw new NotFoundException('Item not found');

    const updatedQueue = await this.queueRepository.update(dto.id, {
      scheduled_time: new Date(),
    });
    this.logger.log(`Forced item ${dto.id}`);
    return updatedQueue;
  }

  async update(dto: UpdateDto, token: string) {
    await this.authService.validateToken(token);

    const item = await this.queueRepository.findOne({ where: { id: dto.id } });
    if (!item) throw new NotFoundException('Item not found');

    const updatedItem = await this.queueRepository.update(dto.id, { ...dto });
    this.logger.log(`Updated item ${dto.id}`);
    return updatedItem;
  }

  async delete(dto: DeleteDto, token: string) {
    await this.authService.validateToken(token);

    const item = await this.queueRepository.findOne({ where: { id: dto.id } });
    if (!item) throw new NotFoundException('Item not found');

    const deletedItem = await this.queueRepository.update(dto.id, {
      status: 'deleted',
    });

    this.logger.log(`Deleted item ${dto.id}`);
    return deletedItem;
  }

  async get(dto: GetDto, token: string) {
    await this.authService.validateToken(token);

    const item = await this.queueRepository.findOne({ where: { id: dto.id } });
    if (!item) throw new NotFoundException('Item not found');

    return item;
  }

  async getAll(token: string) {
    await this.authService.validateToken(token);

    function excludeDeleted(item) {
      return item.status !== 'deleted';
    }

    const items = await this.queueRepository.find({
      order: { scheduled_time: 'ASC' },
    });

    if (!items) throw new NotFoundException('No items found');

    return items.filter(excludeDeleted);
  }

  onModuleInit() {
    setInterval(() => this.sendBackground(), 60000);
  }

  async sendBackground() {
    const queue = await this.queueRepository.findOne({
      where: { status: 'unsent' },
      order: { scheduled_time: 'ASC' },
    });
    if (!queue) return this.logger.warn('No background to send');
    if (queue.scheduled_time > new Date()) return;

    const last_sent_id = await this.redis.get('last_sent_id');
    const webhookUrl = await this.redis.get('webhook_url');

    if (last_sent_id === queue.id) {
      await this.queueRepository.update(queue.id, { status: 'sent' });
      return;
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [
          {
            title: 'Download',
            url: queue.image_url,
            image: {
              url: queue.image_url,
            },
            color: 38143,
            author: {
              name: queue.channel == 'wave' ? 'Wave Music' : 'Paradise Music',
              url:
                queue.channel == 'wave'
                  ? 'https://www.youtube.com/wavemusic'
                  : 'https://www.youtube.com/@paradisemusicgroup',
            },
          },
        ],
      }),
    });
    this.logger.log(`Sent ${queue.id} {-} ${queue.image_url}`);

    await this.queueRepository.update(queue.id, { status: 'sent' });
    await this.redis.set('last_sent_id', queue.id);
  }
}
