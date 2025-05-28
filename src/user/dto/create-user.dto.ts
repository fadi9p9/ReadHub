import { IsEmail, IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(['admin', 'user'])
  role?: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  img?: string;

  isVerified?: boolean;
}
export class GetSubscribedBooksDto {
  @IsNumber()
  userId: number;
}