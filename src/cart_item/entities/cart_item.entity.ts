import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { Cart } from '../../carts/entities/cart.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

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