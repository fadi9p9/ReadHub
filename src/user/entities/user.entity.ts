import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cart } from '../../carts/entities/cart.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { QuestionAnswer } from 'src/question-answer/entities/question-answer.entity';
import { QuizWinner } from 'src/quiz-winner/entities/quiz-winner.entity';
import { QuizResult } from 'src/quiz-result/entities/quiz-result.entity';
import { Reply } from '../../replaies/entities/replay.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  first_name: string;

  @Column({ type: 'varchar', length: 50 })
  last_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  img: string;

  @Column({ nullable: true, type: 'varchar' }) // السماح بقيمة null صراحةً
  token: string | null;

  @Column({ type: 'timestamp', nullable: true }) // السماح بقيمة null
  last_login_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
    likes: any;

    @OneToMany(() => Favorite, favorite => favorite.user)
favorites: Favorite[];

@OneToMany(() => QuestionAnswer, answer => answer.user)
answers: QuestionAnswer[];

@OneToMany(() => QuizResult, result => result.user)
quizResults: QuizResult[];

@OneToMany(() => QuizWinner, winner => winner.user)
quizWinners: QuizWinner[];

@OneToMany(() => Reply, replay => replay.user)
replies: Reply[];

}