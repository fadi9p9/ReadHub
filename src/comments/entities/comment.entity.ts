import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Book } from '../../books/entities/book.entity';
import { Like } from '../../likes/entities/like.entity';
import { Reply } from '../../replaies/entities/replay.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Book, (book) => book.comments,{
    onDelete: 'CASCADE'
  })
  book: Book;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

   @OneToMany(() => Reply, (reply) => reply.comment, {
    onDelete: 'CASCADE' 
  })
  replies: Reply[];


  @OneToMany(() => Like, (like) => like.comment, {
    onDelete: 'CASCADE'
  })
  likes: Like[];
}