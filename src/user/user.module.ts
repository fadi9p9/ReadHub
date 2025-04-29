import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UserModule {}
