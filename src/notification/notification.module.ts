import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { User } from 'src/user/entities/user.entity';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsConnectionService } from './notifications.connection.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification,User]),
    forwardRef(() => AuthModule),],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationsGateway,NotificationsConnectionService,],
  exports: [NotificationService],
})
export class NotificationModule {}
