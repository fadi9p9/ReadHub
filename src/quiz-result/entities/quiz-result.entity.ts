import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class QuizResult {
  @PrimaryGeneratedColumn()
  id: number;

      @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Quiz, (quiz) => quiz.results,{
    onDelete: 'CASCADE'
  })
  quiz: Quiz;

  @ManyToOne(() => User, (user) => user.quizResults,{onDelete: 'CASCADE'})
  user: User;

  @Column({ type: 'int' })
  total_correct: number;

  @Column({ type: 'int' })
  total_questions: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}