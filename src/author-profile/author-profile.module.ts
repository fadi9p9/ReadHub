import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorProfile } from './entities/author-profile.entity';
import { AuthorProfileService } from './author-profile.service';
import { AuthorProfileController } from './author-profile.controller';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorProfile, User])],
  controllers: [AuthorProfileController],
  providers: [AuthorProfileService],
    exports: [TypeOrmModule, AuthorProfileService],
})
export class AuthorProfileModule {}
