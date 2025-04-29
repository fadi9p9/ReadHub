import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Book } from '../../books/entities/book.entity';

@Entity()
@Unique(['user', 'book']) // لمنع التكرار
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites)
  user: User;

  @ManyToOne(() => Book, (book) => book.favorites)
  book: Book;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}