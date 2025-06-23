import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class PendingBook {
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

  // @Column()
  // author: string;

  @ManyToOne(() => User, (user) => user.pendingBooks)
@JoinColumn({ name: 'userId' })
author: User;


  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  rating_count: number;

  @Column({ type: 'int', default: 0 })
  total_pages: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discounted_price: number;

  @Column({ default: false })
  isFree: boolean;

  @Column({ type: 'int', nullable: true })
  userId: number;

  @Column({ default: 'pending' }) 
  status: string;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}