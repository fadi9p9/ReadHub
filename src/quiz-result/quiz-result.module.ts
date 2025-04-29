import { Module } from '@nestjs/common';
import { QuizResultsService } from './quiz-result.service';
import { QuizResultsController } from './quiz-result.controller';
import { QuizResult } from './entities/quiz-result.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([QuizResult])],
  controllers: [QuizResultsController],
  providers: [QuizResultsService],
})
export class QuizResultModule {}
