import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user/entities/user.entity';
import { Book } from './books/entities/book.entity';
import { Cart } from './carts/entities/cart.entity';
import { CartItem } from './cart_item/entities/cart_item.entity';
import { Category } from './categories/entities/category.entity';
import { Comment } from './comments/entities/comment.entity';
import { Like } from './likes/entities/like.entity';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BooksModule } from './books/books.module';
import { CartsModule } from './carts/carts.module';
import { CartItemModule } from './cart_item/cart_item.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { QuizModule } from './quiz/quiz.module';
import { QuizResultModule } from './quiz-result/quiz-result.module';
import { QuizWinnerModule } from './quiz-winner/quiz-winner.module';
import { BookQuestion } from './book-question/entities/book-question.entity';
import { Reply } from './replaies/entities/replay.entity';
import { QuestionAnswer } from './question-answer/entities/question-answer.entity';
import { FavoriteModule } from './favorite/favorite.module';
import { Coupon } from './coupon/entities/coupon.entity';
import { Favorite } from './favorite/entities/favorite.entity';
import { QuizWinner } from './quiz-winner/entities/quiz-winner.entity';
import { BookQuestionModule } from './book-question/book-question.module';
import { BookQuestionsService } from './book-question/book-question.service';
import { ConfigModule } from '@nestjs/config';
import path from 'path';
import { CategoriesModule } from './categories/categories.module';
import { CouponModule } from './coupon/coupon.module';
import { QuestionAnswerModule } from './question-answer/question-answer.module';
import { RepliesModule } from './replaies/replies.module';
import { MailModule } from './auth/mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReminderService } from './reminder/reminder.service';
import { MailService } from './auth/mail/mail.service';
import { PaymentModule } from './payments/payments.module';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
        }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'readhub01',
      entities: [
        User,  
        Book,
        Cart,
        CartItem,
        Category,
        Comment,
        Like,
        BookQuestion,
        Reply,
        QuestionAnswer,
        Coupon,
        Favorite,
        QuizWinner,
        
      ],
      autoLoadEntities: true,
      synchronize: true,
      // dropSchema: true,
    }),
    AuthModule,
    UserModule,
    BooksModule,
    CartsModule,
    CartItemModule,
    CommentsModule,
    LikesModule,
    QuizModule,
    QuizResultModule,
    QuizWinnerModule,
    FavoriteModule,
    BookQuestionModule,
    CategoriesModule,
    CouponModule,
    QuestionAnswerModule,
    RepliesModule,
    UserModule,
    PaymentModule
    
    
  ],
  controllers: [AppController],
  providers: [AppService,ReminderService,MailService],
})
export class AppModule {}