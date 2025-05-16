import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];

  img?: Express.Multer.File;
  pdf?: Express.Multer.File;
}