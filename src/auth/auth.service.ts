import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { UsersService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailService } from './mail/mail.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Cart } from '../carts/entities/cart.entity'; 
@Injectable()
export class AuthService {
  private revokedTokens: Set<string> = new Set();
  private readonly tokenExpiration = '1h';
  logger: any;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async handleGoogleLogin(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
    accessToken: string;
  }): Promise<TokenResponseDto> {
    let user = await this.usersRepository.findOne({ 
      where: { email: googleUser.email },
      select: ['id', 'email', 'first_name', 'last_name', 'role', 'img']
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
      user = await this.usersService.create({
        email: googleUser.email,
        first_name: googleUser.firstName,
        last_name: googleUser.lastName,
        password: hashedPassword,
        role: 'user',
        img: googleUser.picture,
        isVerified: true
      });
    }

    return this.generateTokenResponse(user);
  }

  async signup(createUserDto: CreateUserDto): Promise<void> {
    const existingUser = await this.usersRepository.findOne({ 
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new UnauthorizedException('البريد الإلكتروني مسجل مسبقاً');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || 'user',
      isVerified: false
    });
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password', 'first_name', 'last_name', 'role', 'img', 'isVerified'] 
    });

    if (!user) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('الحساب غير مفعل، يرجى التحقق من خلال رمز OTP');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    const latestUnpaidCart = await this.cartRepository.findOne({
      where: { 
        user: { id: user.id },
        status: 'unpaid'
      },
      relations: ['items', 'items.book'],
      order: { created_at: 'DESC' }
    });

     const tokenResponse = await this.generateTokenResponse(user);
      const cartResponse = latestUnpaidCart ? {
      id: latestUnpaidCart.id,
      status: latestUnpaidCart.status,
      created_at: latestUnpaidCart.created_at,
      items: latestUnpaidCart.items?.map(item => ({
        id: item.id,
        quantity: item.quantity,
        book: item.book ? {
          id: item.book.id,
          title: item.book.title,
          price: item.book.price
        } : null
      })) || []
    } : null;

    return {
      ...tokenResponse,
      cart: cartResponse
    };
  }
  

 
 
   async generateOtp(email: string): Promise<{ message: string }> {
    try {
        if (!email || !email.includes('@')) {
            throw new HttpException(
                'البريد الإلكتروني غير صالح',
                HttpStatus.BAD_REQUEST
            );
        }

        const user = await this.usersRepository.findOne({ 
            where: { email },
            select: ['id', 'email', 'otpLastSentAt']
        });

        if (!user) {
            throw new UnauthorizedException('المستخدم غير موجود');
        }

        const now = new Date();
        const lastSent = user.otpLastSentAt;
        const cooldownPeriod = 60 * 1000; 

        if (lastSent && now.getTime() - lastSent.getTime() < cooldownPeriod) {
            const remainingTime = Math.ceil(
                (cooldownPeriod - (now.getTime() - lastSent.getTime())) / 1000
            );
            throw new HttpException(
                `الرجاء الانتظار ${remainingTime} ثانية قبل الطلب مرة أخرى`,
                HttpStatus.TOO_MANY_REQUESTS
            );
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 

        await this.usersRepository.update(user.id, {
            otpCode: await bcrypt.hash(otp, 10),
            otpExpiresAt,
            otpLastSentAt: now
        });

        await this.mailService.sendOtpEmail(user.email, otp);
        
        return { 
            message: 'تم إرسال رمز التحقق بنجاح' 
        };

    } catch (error) {
        this.logger.error('فشل إرسال OTP:', error.message);
        
        if (error instanceof HttpException) {
            throw error;
        }
        
        throw new HttpException(
            'حدث خطأ أثناء إرسال رمز التحقق',
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}




  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<TokenResponseDto> {
    const user = await this.usersRepository.findOne({ 
      where: { email: verifyOtpDto.email },
      select: ['id', 'email', 'otpCode', 'otpExpiresAt', 'first_name', 'last_name', 'role', 'img']
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      throw new UnauthorizedException('No OTP code generated');
    }

    if (user.otpExpiresAt < new Date()) {
      throw new UnauthorizedException('OTP code expired');
    }

    const isMatch = await bcrypt.compare(verifyOtpDto.otp, user.otpCode);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    await this.usersRepository.update(user.id, {
      isVerified: true, 
      otpCode: undefined,
      otpExpiresAt: undefined,
    });

    return this.generateTokenResponse(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    return this.generateOtp(forgotPasswordDto.email);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ 
      where: { email: resetPasswordDto.email },
      select: ['id', 'otpCode', 'otpExpiresAt']
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      throw new UnauthorizedException('No OTP code generated');
    }

    if (user.otpExpiresAt < new Date()) {
      throw new UnauthorizedException('OTP code expired');
    }

    const isMatch = await bcrypt.compare(resetPasswordDto.otp, user.otpCode);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    
    await this.usersRepository.update(user.id, {
      password: hashedPassword,
  otpCode: undefined,
  otpExpiresAt: undefined,
    });

    return { message: 'Password reset successfully' };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'password']
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    
    await this.usersRepository.update(user.id, {
      password: hashedPassword,
    });

    return { message: 'Password changed successfully' };
  }

  private async generateTokenResponse(user: User): Promise<TokenResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.tokenExpiration
    });

    await this.usersRepository.update(user.id, {
      token: accessToken,
      last_login_at: new Date()
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        img: user.img
      }
    };
  }

  async logout(token: string): Promise<{ message: string }> {
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    try {
      const payload = this.jwtService.verify(token);
      await this.usersRepository.update(payload.sub, {
        token: null
      });

      this.revokedTokens.add(token);
      return { message: 'تم تسجيل الخروج بنجاح' };
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  isTokenRevoked(token: string): boolean {
    return this.revokedTokens.has(token);
  }

  async validateToken(token: string): Promise<User | null> {
    if (this.isTokenRevoked(token)) {
      return null;
    }

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersRepository.findOne({
        where: { id: payload.sub, token }
      });
      return user;
    } catch (e) {
      return null;
    }
  }




  async verifyToken(token: string): Promise<{ id: number; role: string }> {
  try {
    if (this.isTokenRevoked(token)) {
      throw new UnauthorizedException('Token has been revoked');
    }

    const payload = this.jwtService.verify(token);

    const user = await this.usersRepository.findOne({
      where: { id: payload.sub, token }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { id: user.id, role: user.role };
  } catch (e) {
    throw new UnauthorizedException('Invalid token');
  }
}

  
}