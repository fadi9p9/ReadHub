import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.replies)
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  comment: Comment;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}