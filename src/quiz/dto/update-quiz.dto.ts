import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateQuizDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  ar_title?: string;

  @IsOptional()
  @IsInt()
  bookId?: number;
}