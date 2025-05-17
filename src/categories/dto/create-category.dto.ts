import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  title: string;

  @IsString()
  ar_title: string;
}