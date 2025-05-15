import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsNumber()
  ratingCount?: number;

  @IsOptional()
  @IsNumber()
  totalPages?: number;

  @IsOptional()
  @IsNumber()
  totalRatings?: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];
  img: string;
  pdf: string;
}