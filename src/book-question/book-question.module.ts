import { Module } from '@nestjs/common';
import { BookQuestionsService } from './book-question.service';
import { BookQuestionsController } from './book-question.controller';
import { BookQuestion } from './entities/book-question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from '../books/books.module';
import { QuizModule } from '../quiz/quiz.module';
import { BookQuestionTranslation } from './entities/book-question-translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookQuestion, BookQuestionTranslation]),
    BooksModule,QuizModule], 
  controllers: [BookQuestionsController],
  providers: [BookQuestionsService],
  exports: [ TypeOrmModule],
})
export class BookQuestionModule {}
