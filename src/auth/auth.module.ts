import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from '../user/user.service';
import { JwtStrategy } from './jwt.strategy';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [

    MailModule,
    PassportModule.register({ defaultStrategy: ['google', 'jwt'] }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, UsersService, JwtStrategy, MailService],
  exports: [AuthService],
})
export class AuthModule {}