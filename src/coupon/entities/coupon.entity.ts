import { Entity, PrimaryGeneratedColumn, Column, OneToOne, UpdateDateColumn } from 'typeorm';
import { QuizWinner } from '../../quiz-winner/entities/quiz-winner.entity';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  discount_value: number;
  
    @UpdateDateColumn()
  updated_at: Date;

    @UpdateDateColumn()
    created_at: Date;
  @OneToOne(() => QuizWinner, winner => winner.coupon)
  winner: QuizWinner;
  user: any;
}