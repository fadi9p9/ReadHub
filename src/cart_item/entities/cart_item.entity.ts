import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { Cart } from '../../carts/entities/cart.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

    @UpdateDateColumn()
  updated_at: Date;


  @ManyToOne(() => Cart, (cart) => cart.items,{
    onDelete: 'CASCADE'
  })
  cart: Cart;

  @ManyToOne(() => Book, (book) => book.cartItems,{
    onDelete: 'CASCADE'
  })
  book: Book;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}