import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateQuestionAnswerDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  question_id: number;

  @IsString()
  selected_option: string;

  @IsBoolean()
  isCorrect: boolean;
  questionId: any;
}
