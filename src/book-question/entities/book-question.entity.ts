import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { QuestionAnswer } from 'src/question-answer/entities/question-answer.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';

@Entity('book_questions') 
export class BookQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookId: number;

  @ManyToOne(() => Book, (book) => book.questions)
  book: Book;

  @Column({ type: 'text' })
  question_text: string;

  @Column({ type: 'varchar', length: 255 })
  option_a: string;

  @Column({ type: 'varchar', length: 255 })
  option_b: string;

  @Column({ type: 'varchar', length: 255 })
  option_c: string;

  @Column({ type: 'varchar', length: 255 })
  option_d: string;

  @Column({ type: 'enum', enum: ['a', 'b', 'c', 'd'] })
  correct_option: string;

  @OneToMany(() => QuestionAnswer, answer => answer.question)
answers: QuestionAnswer[];

@ManyToOne(() => Quiz, quiz => quiz.questions)
quiz: Quiz;
}