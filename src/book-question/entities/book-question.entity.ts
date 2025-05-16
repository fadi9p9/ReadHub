import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { QuestionAnswer } from '../../question-answer/entities/question-answer.entity';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { BookQuestionTranslation } from './book-question-translation.entity';

@Entity('book_questions')
export class BookQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'book_id' })
  bookId: number;

  @ManyToOne(() => Book, (book) => book.questions)
  book: Book;

  @Column({ name: 'question_text', type: 'text' })
  question_text: string;

  @Column({ name: 'option_a', type: 'varchar', length: 255 })
  option_a: string;

  @Column({ name: 'option_b', type: 'varchar', length: 255 })
  option_b: string;

  @Column({ name: 'option_c', type: 'varchar', length: 255 })
  option_c: string;

  @Column({ name: 'option_d', type: 'varchar', length: 255 })
  option_d: string;

  @Column({ name: 'correct_option', type: 'enum', enum: ['a', 'b', 'c', 'd'] })
  correct_option: string;

  @OneToMany(() => QuestionAnswer, (answer) => answer.question)
  answers: QuestionAnswer[];

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  quiz: Quiz;

  @OneToMany(() => BookQuestionTranslation, (trans) => trans.question)
  translations: BookQuestionTranslation[];
}