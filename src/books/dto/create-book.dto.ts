import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  ar_title?: string;

  @IsOptional()
  @IsString()
  ar_description?: string;

  @IsString()
  author: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discount?: number = 0;

  @IsOptional()
  @IsNumber()
  total_pages?: number = 0;

  @IsOptional()
  @IsNumber()
  rating_count?: number = 0;

 

  @IsOptional()
  @IsNumber()
  rating?: number = 0;

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];
}