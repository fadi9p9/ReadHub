import { IsOptional, IsInt, IsString } from 'class-validator';

export class PaginationFavoriteDto {
  @IsOptional()
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @IsInt()
  limit?: number = 10;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  bookId?: number;

    @IsOptional()
  @IsString()
  sort?: 'newest' | 'oldest' = 'newest';
}