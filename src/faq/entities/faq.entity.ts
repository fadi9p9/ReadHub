import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('frequently_asked_questions')
export class Faq {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'en_question', type: 'text' })
  enQuestion: string;

  @Column({ name: 'en_answer', type: 'text' })
  enAnswer: string;

  @Column({ name: 'ar_question', type: 'text' })
  arQuestion: string;

  @Column({ name: 'ar_answer', type: 'text' })
  arAnswer: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  isPublished: 'active' | 'inactive';

  
      @UpdateDateColumn()
      created_at: Date;

      @UpdateDateColumn()
      updated_at: Date;
}