import { IsString, IsInt } from 'class-validator';

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsString()
  ar_title: string;

  @IsInt()
  bookId: number;
}