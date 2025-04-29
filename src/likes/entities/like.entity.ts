import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
@Unique(['user', 'comment']) // لمنع الإعجاب المكرر
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.likes)
  comment: Comment;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}