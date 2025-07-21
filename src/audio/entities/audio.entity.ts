import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/user/entities/user.entity';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';

@Entity()
export class Audio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;
  
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ar_title: string | null;

  @Column({ type: 'text', nullable: true })
  ar_description: string | null;

  @Column({ type: 'varchar', length: 255 })
  filePath: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  img: string | null;

  @Column({ type: 'int' })
  duration: number; 

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

  @OneToOne(() => Book, (book) => book.audio, {
    onDelete: 'CASCADE',
    eager: false,
  })
  
  @JoinColumn() 
  book: Book;
  @Column({ nullable: true })
  bookId: number | null;

  @ManyToOne(() => User, (user) => user.audios, { 
    eager: false, 
    onDelete: 'CASCADE',
    nullable: true 
    })

  user: User;
  @Column({ nullable: true })
  userId: number | null;

  @OneToMany(() => CartItem, (cartItem) => cartItem.audio,{
      onDelete: 'CASCADE',
    })
    cartItems: CartItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
