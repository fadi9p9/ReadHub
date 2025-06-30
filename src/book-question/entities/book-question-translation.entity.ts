import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn } from 'typeorm';
import { BookQuestion } from './book-question.entity';

@Entity('book_question_translations')
export class BookQuestionTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lang: string;

  @Column({ name: 'question_text', type: 'text' })
  question_text: string;

  @Column({ name: 'option_a', length: 255 })
  option_a: string;

  @Column({ name: 'option_b', length: 255 })
  option_b: string;

  @Column({ name: 'option_c', length: 255 })
  option_c: string;

  @Column({ name: 'option_d', length: 255 })
  option_d: string;
    @UpdateDateColumn()
  updated_at: Date;


  
  @ManyToOne(() => BookQuestion, (question) => question.translations,{
    onDelete:'CASCADE'
  })
  question: BookQuestion;
}