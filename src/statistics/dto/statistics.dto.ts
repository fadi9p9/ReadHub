import { IsOptional, IsNumber } from 'class-validator';

export class StatisticsDto {
  @IsOptional()
  @IsNumber()
  userId?: number;
}