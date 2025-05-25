import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

      @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.replies,{onDelete: 'CASCADE'})
  user: User;

@ManyToOne(() => Comment, (comment) => comment.replies, { onDelete: 'CASCADE' })
comment: Comment;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}