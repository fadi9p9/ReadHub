import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';  
import { QuizzesService } from './quiz.service';
import { QuizzesController } from './quiz.controller';
import { Book } from '../books/entities/book.entity';
import { QuizResult } from 'src/quiz-result/entities/quiz-result.entity';
import { QuizWinner } from 'src/quiz-winner/entities/quiz-winner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz,Book, QuizResult, QuizWinner])],  
  providers: [QuizzesService],
  controllers: [QuizzesController],
  exports:[TypeOrmModule],
})
export class QuizModule {}
