import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Book } from '../books/entities/book.entity';
import { Cart } from '../carts/entities/cart.entity';
import { User } from '../user/entities/user.entity';
import { Quiz } from '../quiz/entities/quiz.entity';
import { Coupon } from '../coupon/entities/coupon.entity';
import { QuizResult } from 'src/quiz-result/entities/quiz-result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Cart, User, Quiz, QuizResult,Coupon])
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService]
})
export class StatisticsModule {}