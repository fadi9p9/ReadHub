import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { BookQuestion } from '../../book-question/entities/book-question.entity'; // مسار معدل
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  img: string;

  @Column({ type: 'varchar', length: 100 })
  author: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pdf: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToMany(() => Category)
  @JoinTable({ name: 'book_categories' })
  categories: Category[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.book)
  cartItems: CartItem[];

  @OneToMany(() => Comment, (comment) => comment.book)
  comments: Comment[];
  
  @OneToMany(() => BookQuestion, (question) => question.book, {
    onDelete: 'CASCADE', // تحسين إضافي
  })
  questions: BookQuestion[];

  @OneToMany(() => Favorite, favorite => favorite.book)
favorites: Favorite[];

@OneToMany(() => Quiz, quiz => quiz.book)
quizzes: Quiz[];


}