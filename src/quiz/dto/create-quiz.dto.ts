import { IsInt, IsString } from 'class-validator';

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsInt()
  bookId: number;
}