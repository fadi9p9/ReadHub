import { IsInt, IsArray } from 'class-validator';

export class CreateCartDto {
  @IsInt()
  userId: number;

  @IsArray()
  @IsInt({ each: true })
  items: number[]; 
}