import { BookQuestion } from "../../book-question/entities/book-question.entity";
import { User } from "../../user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity('question_answers')
export class QuestionAnswer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'is_correct' }) 
    isCorrect: boolean

    @ManyToOne(() => User, (user) => user.answers)
    user: User;

    @ManyToOne(() => BookQuestion, (question) => question.answers,{
        onDelete: 'CASCADE'
    })
    question: BookQuestion;

    @Column()
    selected_option: string;
}
