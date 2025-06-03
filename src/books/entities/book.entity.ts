import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { BookQuestion } from '../../book-question/entities/book-question.entity';
import { CartItem } from '../../cart_item/entities/cart_item.entity';
import { Favorite } from '../../favorite/entities/favorite.entity';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ar_title: string | null;

  @Column({ type: 'text', nullable: true })
  ar_description: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  img: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pdf: string | null;

  @Column({ type: 'varchar', length: 100 })
  author: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  rating_count: number;

  @Column({ type: 'int', default: 0 })
  total_pages: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
discounted_price: number | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

    @UpdateDateColumn()
    ceated_at: Date;

  @ManyToMany(() => Category,{
  })
  @JoinTable({ name: 'book_categories' })
  categories: Category[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.book,{
    onDelete: 'CASCADE',
  })
  cartItems: CartItem[];

  @OneToMany(() => Comment, (comment) => comment.book, {
  onDelete: 'CASCADE',
})
comments: Comment[];
likeCount: number;

  
  @OneToMany(() => BookQuestion, (question) => question.book, {
    // cascade: true,
    onDelete: 'CASCADE',
  })
  questions: BookQuestion[];

  @OneToMany(() => Favorite, (favorite) => favorite.book, {
    onDelete: 'CASCADE',
  })
  favorites: Favorite[];

  @OneToMany(() => Quiz, (quiz) => quiz.book,{
    onDelete: 'CASCADE',
  })
  quizzes: Quiz[];

  @Column({ default: false })
  isFree: boolean;

  @ManyToOne(() => User, (user) => user.books, { eager: false, onDelete: 'CASCADE' })
user: User;

@Column()
userId: number;
}