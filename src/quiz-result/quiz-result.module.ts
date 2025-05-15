import { Module } from '@nestjs/common';
import { QuizResultsService } from './quiz-result.service';
import { QuizResultsController } from './quiz-result.controller';
import { QuizResult } from './entities/quiz-result.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from '../quiz/entities/quiz.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizResult,Quiz,User])],
  controllers: [QuizResultsController],
  providers: [QuizResultsService],
})
export class QuizResultModule {}
