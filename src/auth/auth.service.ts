import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { LoginDto, SignUpDto } from './dto/auth.dto';
import { Repository } from 'typeorm';
import { Users } from './auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

@Injectable({})
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const sender = await this.usersRepository.findOne({
      where: { id: signUpDto.sender_id },
    });
    if (!sender) throw new NotFoundException('Sender not found');
    if (sender.role != 1) throw new ForbiddenException('Sender is not admin');
    const user = await this.usersRepository.findOne({
      where: { username: signUpDto.username },
    });
    if (user) throw new BadRequestException('Username already exists');

    const password = await argon2.hash(signUpDto.password);

    const newUser = this.usersRepository.create({ ...signUpDto, password });
    const savedUser = await this.usersRepository.save(newUser);
    this.logger.log(`User ${savedUser.username} created`);

    return savedUser;
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { username: dto.username },
    });
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await argon2.verify(user.password, dto.password);
    if (!isPasswordValid) throw new BadRequestException('Invalid password');

    const token = crypto.randomBytes(1024).toString('hex');
    const expiry = 60 * 60 * 12;
    await this.redis.set(token, user.id, 'EX', expiry);

    this.usersRepository.update(user.id, { last_login: new Date() });

    return { id: user.id, token, expiry };
  }

  async logout(token: string) {
    const user = await this.redis.get(token);
    if (!user) throw new UnauthorizedException('Invalid token');

    await this.redis.del(token);
  }

  async validateToken(token: string) {
    const userId = await this.redis.get(token);
    if (!userId) throw new UnauthorizedException('Invalid token');

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }
}
