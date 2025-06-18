import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {

    @IsOptional()
  imgFile?: Express.Multer.File;

  @IsOptional()
  pdfFile?: Express.Multer.File;
  
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];

  img?: string ;
  pdf?: string ;
}