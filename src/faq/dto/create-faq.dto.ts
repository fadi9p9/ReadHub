import { IsString, IsEnum } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  enQuestion: string;

  @IsString()
  enAnswer: string;

  @IsString()
  arQuestion: string;

  @IsString()
  arAnswer: string;

  @IsEnum(['active', 'inactive'])
  isPublished: 'active' | 'inactive';
}