import { PartialType } from '@nestjs/mapped-types';
import { CreateLikeDto } from './create-like.dto';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateLikeDto extends PartialType(CreateLikeDto) {
    @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  commentId?: number;
}
