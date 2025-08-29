import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Category } from '../categories/entities/category.entity';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { UsersService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AudioService } from 'src/audio/audio.service';
import { Audio } from 'src/audio/entities/audio.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';  
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
   imports: [
    TypeOrmModule.forFeature([Book, Category, User, Audio, Favorite]),
    UserModule,
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
  controllers: [BooksController],
  providers: [BooksService, UsersService, AudioService],
  exports: [BooksService, UsersService, AudioService]
})
export class BooksModule {}