import { Module } from '@nestjs/common';
import { BookQuestionsService } from './book-question.service';
import { BookQuestionsController } from './book-question.controller';
import { BookQuestion } from './entities/book-question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BookQuestion])], // ← تأكد من وجود هذا السطر!
  controllers: [BookQuestionsController],
  providers: [BookQuestionsService],
})
export class BookQuestionModule {}
