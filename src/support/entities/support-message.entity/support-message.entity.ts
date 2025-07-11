import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('support_messages')
export class SupportMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.supportMessages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text')
  message: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  from: 'user' | 'admin';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ default: false, name: 'is_read' })
  isRead: boolean;
}