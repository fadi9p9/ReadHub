import { IsInt, IsString, IsEnum } from 'class-validator';

export class CreateBookQuestionDto {
  @IsInt()
  bookId: number; 

  @IsString()
  question_text: string;

  @IsString()
  option_a: string;

  @IsString()
  option_b: string;

  @IsString()
  option_c: string;

  @IsString()
  option_d: string;

  @IsEnum(['a', 'b', 'c', 'd'])
  correct_option: string;
}