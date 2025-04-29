import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';  // تأكد من أن `Quiz` هو الكائن الصحيح
import { QuizzesService } from './quiz.service';
import { QuizzesController } from './quiz.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz])],  // إضافة هذه السطر لتضمين `QuizRepository`
  providers: [QuizzesService],
  controllers: [QuizzesController],
})
export class QuizModule {}
