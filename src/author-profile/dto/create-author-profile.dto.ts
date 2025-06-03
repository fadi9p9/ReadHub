import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthorProfileDto {
  @IsNotEmpty()
  userId: number;

  @IsOptional()
  @IsString()
  bio_ar?: string;

  @IsOptional()
  @IsString()
  bio_en?: string;

  @IsOptional()
  @IsString()
  works_ar?: string;

  @IsOptional()
  @IsString()
  works_en?: string;
}
