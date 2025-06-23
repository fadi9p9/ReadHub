import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray
} from 'class-validator';

export class CreatePendingBookDto {
  @IsOptional()
  imgFile?: Express.Multer.File;

  @IsOptional()
  pdfFile?: Express.Multer.File;

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

  @IsOptional()
  @IsString()
  img?: string;

  @IsOptional()
  @IsString()
  pdf?: string;

  // @IsString()
  // author: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsNumber()
  rating_count?: number;

  @IsOptional()
  @IsNumber()
  total_pages?: number;

  @IsOptional()
  @IsNumber()
  discounted_price?: number;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsNumber()
  userId?: number;
}