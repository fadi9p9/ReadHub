import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  IsDecimal,
} from 'class-validator';

export class CreateBookDto {
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

  @IsString()
  author: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discount?: number = 0;

  @IsOptional()
  @IsNumber()
  rating?: number = 0;

  @IsOptional()
  @IsNumber()
  rating_count?: number = 0;

  @IsOptional()
  @IsNumber()
  total_pages?: number = 0;

  @IsOptional()
  @IsNumber()
  discounted_price?: number;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean = false;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];

  @IsOptional()
  @IsNumber()
  userId?: number | null;
}
