// src/question-answers/entities/question-answer.entity.ts
// import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { BookQuestion } from "src/book-question/entities/book-question.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity('question_answers')
export class QuestionAnswer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'is_correct' }) 
    isCorrect: boolean

    @ManyToOne(() => User, (user) => user.answers)
    user: User;

    @ManyToOne(() => BookQuestion, (question) => question.answers)
    question: BookQuestion;

    @Column()
    selected_option: string;
}
