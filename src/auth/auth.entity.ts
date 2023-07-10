import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Column({ type: 'int', default: '0' })
  role: number;

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn()
  created_at: Date;

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  last_login?: Date;
}
