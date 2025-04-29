import { Module } from '@nestjs/common';
import { QuizWinnersService } from './quiz-winner.service';
import { QuizWinnersController } from './quiz-winner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizWinner } from './entities/quiz-winner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizWinner])],
  controllers: [QuizWinnersController],
  providers: [QuizWinnersService],
})
export class QuizWinnerModule {}
