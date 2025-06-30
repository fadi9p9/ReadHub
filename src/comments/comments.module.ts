import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';  
import { Book } from '../books/entities/book.entity';  
import { User } from '../user/entities/user.entity';
import { Reply } from 'src/replaies/entities/replay.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Book,Reply]),  
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
