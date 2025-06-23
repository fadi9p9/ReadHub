import { IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  userId: number;

  @IsString()
  message: string;

  @IsString()
  type: string; 
}
