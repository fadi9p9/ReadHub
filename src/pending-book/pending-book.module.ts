import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingBooksController } from './pending-book.controller';
import { PendingBooksService } from './pending-book.service';
import { PendingBook } from './entities/pending-book.entity';
import { Book } from '../books/entities/book.entity';
import { Category } from '../categories/entities/category.entity';
import { NotificationModule } from '../notification/notification.module';
import { User } from 'src/user/entities/user.entity';
import { Notification } from 'src/notification/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PendingBook, Book, Category,User,Notification]),
    NotificationModule,
  ],
  controllers: [PendingBooksController],
  providers: [PendingBooksService],
  exports: [PendingBooksService],
})
export class PendingBookModule {}
