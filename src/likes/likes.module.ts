import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';  // تأكد من أن `Like` هو الكائن الصحيح
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],  // إضافة هذه السطر لتضمين `LikeRepository`
  providers: [LikesService],
  controllers: [LikesController],
})
export class LikesModule {}
