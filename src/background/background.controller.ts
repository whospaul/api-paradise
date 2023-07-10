import {
  Controller,
  Post,
  Body,
  Headers,
  Get,
  Delete,
  Put,
} from '@nestjs/common';
import { BackgroundService } from './background.service';
import {
  DeleteDto,
  ForceDto,
  GetDto,
  UpdateDto,
  UrlDto,
} from './dto/background.dto';

@Controller('background')
export class BackgroundController {
  constructor(private backgroundService: BackgroundService) {}

  @Post('url')
  url(@Body() dto: UrlDto, @Headers('Authorization') token: string) {
    return this.backgroundService.url(dto, token);
  }

  @Post('force')
  force(@Body() dto: ForceDto, @Headers('Authorization') token: string) {
    return this.backgroundService.force(dto, token);
  }

  @Put()
  update(@Body() dto: UpdateDto, @Headers('Authorization') token: string) {
    return this.backgroundService.update(dto, token);
  }

  @Delete()
  delete(@Body() dto: DeleteDto, @Headers('Authorization') token: string) {
    return this.backgroundService.delete(dto, token);
  }

  @Get()
  get(@Body() dto: GetDto, @Headers('Authorization') token: string) {
    return this.backgroundService.get(dto, token);
  }

  @Get('all')
  getAll(@Headers('Authorization') token: string) {
    return this.backgroundService.getAll(token);
  }
}
