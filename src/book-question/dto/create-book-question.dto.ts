import { IsInt, IsString, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class QuestionTranslationDto {
  @IsString()
  lang: string;

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
}

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

  @IsInt()
  quizId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionTranslationDto)
  translations?: QuestionTranslationDto[];
}