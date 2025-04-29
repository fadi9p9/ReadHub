import { IsInt } from 'class-validator';

export class CreateQuizWinnerDto {
  @IsInt()
  quizId: number;

  @IsInt()
  userId: number;

  @IsInt()
  couponId: number;
}