import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, Column, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Book } from '../../books/entities/book.entity';

@Entity()
@Unique(['user', 'book'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

      @UpdateDateColumn()
  updated_at: Date;


  
  @ManyToOne(() => User, (user) => user.favorites,{onDelete: 'CASCADE'})
  user: User;

  @ManyToOne(() => Book, (book) => book.favorites,{
    onDelete: 'CASCADE'
  })
  book: Book;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  favorite: { id: number; };
}