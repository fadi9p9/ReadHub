import { Controller, Post, Body, Req, UseGuards, Get, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

 @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    await this.authService.signup(createUserDto);
    return this.authService.generateOtp(createUserDto.email);
  }

  @Post('resend-otp')
async resendOtp(@Body() { email }: { email: string }) {
  try {
    const result = await this.authService.generateOtp(email);
    return result;
  } catch (error) {
    console.error('تفاصيل الخطأ:', error); 
    throw new HttpException(
      error.message || 'فشل إعادة إرسال الرمز',
      error.status || HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<TokenResponseDto> {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<TokenResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }

 @Post('change-password')
@UseGuards(JwtAuthGuard)
async changePassword(@Req() req: Request, @Body() changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
  const userId = (req.user as any).userId; 
  return this.authService.changePassword(userId, changePasswordDto);
}

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request): Promise<{ message: string }> {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [bearer, token] = authHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    return this.authService.logout(token);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request) {
    const googleUser = req.user as {
      email: string;
      firstName: string;
      lastName: string;
      picture?: string;
      accessToken: string;
    };
    
    return this.authService.handleGoogleLogin(googleUser);
  }
  


}