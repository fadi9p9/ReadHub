import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string; 

  @IsInt()
  userId: number; 

  @IsString()
  title: string;

  @IsInt()
  bookId: number; 

  @IsOptional()
  @IsInt()
  parentId?: number;
}