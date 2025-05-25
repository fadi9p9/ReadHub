import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CartItem } from '../../cart_item/entities/cart_item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

@Column({ type: 'enum', enum: ['paid', 'unpaid'], default: 'unpaid' })
  status: string;

  @ManyToOne(() => User, (user) => user.carts,{onDelete: 'CASCADE'})
  user: User;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
    @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  items: CartItem[];
}