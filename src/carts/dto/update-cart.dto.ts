import { IsInt, IsArray, IsOptional } from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @IsInt()
  userId?: number;
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  items?: number[];
  @IsOptional()
  status?: string;
}