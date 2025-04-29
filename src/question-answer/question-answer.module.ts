import { Module } from '@nestjs/common';
import { QuestionAnswersService } from './question-answer.service';
import { QuestionAnswersController } from './question-answer.controller';

@Module({
  controllers: [QuestionAnswersController],
  providers: [QuestionAnswersService],
})
export class QuestionAnswerModule {}
