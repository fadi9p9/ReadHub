import { IsOptional, IsInt, IsString } from 'class-validator';

export class PaginationCommentDto {
  @IsOptional()
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @IsInt()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  email?: string;
  

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  bookId?: number;

  @IsOptional()
  @IsInt()
  userId?: number;
}