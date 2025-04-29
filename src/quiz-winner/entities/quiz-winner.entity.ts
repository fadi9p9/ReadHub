// في quiz-winner.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, Column } from 'typeorm';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { User } from '../../user/entities/user.entity';
import { Coupon } from '../../coupon/entities/coupon.entity';

@Entity()
export class QuizWinner {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Quiz)
  quiz: Quiz;

  @ManyToOne(() => User)
  user: User;

  @OneToOne(() => Coupon)
  @JoinColumn()
  coupon: Coupon;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}