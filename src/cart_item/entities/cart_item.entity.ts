import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from '../../carts/entities/cart.entity';
import { Book } from '../../books/entities/book.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  @ManyToOne(() => Book, (book) => book.cartItems)
  book: Book;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}