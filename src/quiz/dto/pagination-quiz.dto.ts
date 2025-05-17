import { IsOptional, IsNumber, IsString } from 'class-validator';

export class PaginationQuizDto {
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  bookId?: number;

  @IsOptional()
  @IsString()
  lang?: string;
}