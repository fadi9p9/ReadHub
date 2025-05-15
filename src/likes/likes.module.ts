import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { User } from '../user/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like,User,Comment])],
  providers: [LikesService],
  controllers: [LikesController],
})
export class LikesModule {}
