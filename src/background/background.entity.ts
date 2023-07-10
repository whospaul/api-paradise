import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Queue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  scheduled_time: Date;

  @CreateDateColumn()
  upload_time: Date;

  @Column({ default: 'unsent' })
  status: string;

  @Column()
  channel: string;

  @Column({ default: 'url' })
  source: string;

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  image_url?: string;
}
