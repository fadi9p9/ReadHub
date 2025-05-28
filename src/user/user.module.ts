import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';
import { CronService } from 'src/cron/cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, cb) => {
          const randomName = crypto.randomBytes(16).toString('hex'); 
          const ext = path.extname(file.originalname).toLowerCase();
          cb(null, `${randomName}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
          'image/tiff',
          'image/bmp',
        ];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 10, 
      },
    }),
  ],
  controllers: [UserController],
  providers: [UsersService,CronService],
  exports: [UsersService, TypeOrmModule],
})
export class UserModule {}