import { IsString, IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsNumber()
  discount_value: number;

  @IsDateString()
  valid_until: Date;

  @IsBoolean()
  is_active: boolean;
}