import { IsString, IsNumber, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateAudioDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  filePath: string;
  
  @IsOptional()
  @IsNumber()
  bookId: number;

  @IsOptional()
  @IsString()
  img?: string;

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