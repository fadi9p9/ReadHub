import { IsInt, IsString, Length } from 'class-validator';

export class CreateReplyDto {
  @IsInt()
  userId: number;

  @IsInt()
  commentId: number;

  @IsString()
  @Length(10, 500)
  text: string;
}