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

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Category,User, Audio]), UserModule
  ],
  controllers: [BooksController],
  providers: [BooksService,UsersService, AudioService],
  exports: [BooksService,UsersService, AudioService]
})
export class BooksModule {}