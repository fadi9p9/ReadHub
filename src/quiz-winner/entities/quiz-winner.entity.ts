import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, Column, UpdateDateColumn } from 'typeorm';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { User } from '../../user/entities/user.entity';
import { Coupon } from '../../coupon/entities/coupon.entity';

@Entity()
export class QuizWinner {
  @PrimaryGeneratedColumn()
  id: number;

      @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Quiz,{
    onDelete: 'CASCADE'
  })
  quiz: Quiz;

@ManyToOne(() => User,{onDelete: 'CASCADE'
  })
  user: User;

  @OneToOne(() => Coupon,{
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  coupon: Coupon;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}