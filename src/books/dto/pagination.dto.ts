import { IsOptional, IsNumber, IsString, IsArray } from 'class-validator';

export class PaginationDto {
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
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  minRating?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];

  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  newest?: boolean;

  @IsOptional()
  highestRated?: boolean;
}