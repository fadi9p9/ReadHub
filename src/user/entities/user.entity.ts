import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn } from 'typeorm';
import { Cart } from '../../carts/entities/cart.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Favorite } from '../../favorite/entities/favorite.entity';
import { QuestionAnswer } from '../../question-answer/entities/question-answer.entity';
import { QuizWinner } from '../../quiz-winner/entities/quiz-winner.entity';
import { QuizResult } from '../../quiz-result/entities/quiz-result.entity';
import { Reply } from '../../replaies/entities/replay.entity';
import { Like } from 'src/likes/entities/like.entity';
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

  @Column({ type: 'enum', enum: ['admin', 'user','author'], default: 'user' })
  role: string;

  @Column({ type: 'varchar', length: 100, unique: true ,nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  img: string;

      @UpdateDateColumn()
  updated_at: Date;


  @Column({ nullable: true, type: 'varchar' }) 
  token: string | null;

  @Column({ type: 'timestamp', nullable: true }) 
  last_login_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ name: 'otp_code', nullable: true })
otpCode?: string;

@Column({ name: 'otp_expires_at', nullable: true })
otpExpiresAt?: Date;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ name: 'otp_last_sent_at', nullable: true })
otpLastSentAt?: Date;

@Column({ name: 'otp_attempts', default: 0 })
otpAttempts: number;

  @OneToMany(() => Cart, (cart) => cart.user,{onDelete: 'CASCADE'})
  carts: Cart[];

  @OneToMany(() => Comment, (comment) => comment.user,{onDelete: 'CASCADE'})
  comments: Comment[];
  
  @OneToMany(() => Like, (like) => like.user)
likes: Like[];

    @OneToMany(() => Favorite, favorite => favorite.user,{onDelete: 'CASCADE'})
favorites: Favorite[];

@OneToMany(() => QuestionAnswer, answer => answer.user,{onDelete: 'CASCADE'})
answers: QuestionAnswer[];

@OneToMany(() => QuizResult, result => result.user,{
  onDelete: 'CASCADE',
})
quizResults: QuizResult[];

@OneToMany(() => QuizWinner, winner => winner.user,{
  onDelete: 'CASCADE',
})
quizWinners: QuizWinner[];

@OneToMany(() => Reply, replay => replay.user,{onDelete: 'CASCADE'})
replies: Reply[];


 @Column('boolean', { default: false })
isSubscribed: boolean;

@Column('varchar', { nullable: true })
subscriptionType: 'monthly' | 'yearly' | null;

@Column('datetime', { nullable: true })
subscriptionEndsAt: Date | null;




}