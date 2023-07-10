import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackgroundService } from './background.service';
import { Queue } from './background.entity';
import { BackgroundController } from './background.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Queue]), AuthModule],
  controllers: [BackgroundController],
  providers: [BackgroundService],
})
export class BackgroundModule {}
