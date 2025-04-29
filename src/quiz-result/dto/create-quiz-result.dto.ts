import { IsInt } from 'class-validator';

export class CreateQuizResultDto {
  @IsInt()
  quizId: number;

  @IsInt()
  userId: number;

  @IsInt()
  total_correct: number;

  @IsInt()
  total_questions: number;
}