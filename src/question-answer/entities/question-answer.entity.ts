import { BookQuestion } from "../../book-question/entities/book-question.entity";
import { User } from "../../user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('question_answers')
export class QuestionAnswer {
    @PrimaryGeneratedColumn()
    id: number;

        @UpdateDateColumn()
  updated_at: Date;

    @UpdateDateColumn()
    created_at: Date;

    @Column({ name: 'is_correct' }) 
    isCorrect: boolean

    @ManyToOne(() => User, (user) => user.answers,{onDelete: 'CASCADE'})
    user: User;

    @ManyToOne(() => BookQuestion, (question) => question.answers,{
        onDelete: 'CASCADE'
    })
    question: BookQuestion;

    @Column()
    selected_option: string;
}
