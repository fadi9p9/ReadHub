import { Module } from '@nestjs/common';
import { QuestionAnswersService } from './question-answer.service';
import { QuestionAnswersController } from './question-answer.controller';
import { QuestionAnswer } from './entities/question-answer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { BookQuestion } from '../book-question/entities/book-question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionAnswer,User,BookQuestion])],
  controllers: [QuestionAnswersController],
  providers: [QuestionAnswersService],
})
export class QuestionAnswerModule {}
