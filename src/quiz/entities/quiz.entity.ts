import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, UpdateDateColumn } from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { QuizResult } from '../../quiz-result/entities/quiz-result.entity';
import { QuizWinner } from '../../quiz-winner/entities/quiz-winner.entity';
import { BookQuestion } from '../../book-question/entities/book-question.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ar_title: string;
    @UpdateDateColumn()
  updated_at: Date;


  @ManyToOne(() => Book, (book) => book.quizzes, { onDelete: 'CASCADE' })
  book: Book;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => BookQuestion, (question) => question.quiz)
  questions: BookQuestion[];

  @OneToMany(() => QuizResult, (result) => result.quiz)
  results: QuizResult[];
  
  @OneToMany(() => QuizWinner, (winner) => winner.quiz)
  winners: QuizWinner[];
}