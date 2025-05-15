import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { UsersService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@Injectable()
export class AuthService {
  private revokedTokens: Set<string> = new Set();
  private readonly tokenExpiration = '1h';

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
        img: googleUser.picture
      });
    }

    return this.generateTokenResponse(user);
  }

  async signup(createUserDto: CreateUserDto): Promise<TokenResponseDto> {
    const existingUser = await this.usersRepository.findOne({ 
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new UnauthorizedException('البريد الإلكتروني مسجل مسبقاً');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || 'user'
    });
    
    return this.generateTokenResponse(newUser);
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password', 'first_name', 'last_name', 'role', 'img'] 
    });

    if (!user) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    return this.generateTokenResponse(user);
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
}

