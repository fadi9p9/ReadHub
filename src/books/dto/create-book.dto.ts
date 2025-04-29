import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  img?: string;

  @IsString()
  author: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsString()
  pdf?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];
}