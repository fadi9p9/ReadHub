import { Module } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { RepliesController } from './replies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './entities/replay.entity';
import { User } from 'src/user/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Reply,User,Comment])],
  controllers: [RepliesController],
  providers: [RepliesService],
})
export class RepliesModule {}
