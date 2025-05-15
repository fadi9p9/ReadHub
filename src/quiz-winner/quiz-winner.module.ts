import { Module } from '@nestjs/common';
import { QuizWinnersService } from './quiz-winner.service';
import { QuizWinnersController } from './quiz-winner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizWinner } from './entities/quiz-winner.entity';
import { Quiz } from '../quiz/entities/quiz.entity';
import { User } from '../user/entities/user.entity';
import { Coupon } from '../coupon/entities/coupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizWinner,Quiz,User,Coupon])],
  controllers: [QuizWinnersController],
  providers: [QuizWinnersService],
})
export class QuizWinnerModule {}
