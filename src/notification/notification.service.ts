import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user/entities/user.entity';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsConnectionService } from './notifications.connection.service';

@Injectable()
export class NotificationService {
   constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway: NotificationsGateway,

    private readonly connectionService: NotificationsConnectionService,
  ) {}

  async create(dto: CreateNotificationDto) {
    const notification = this.notificationRepo.create(dto);
    const savedNotification = await this.notificationRepo.save(notification);
    
    this.notificationsGateway.sendNewNotification(dto.userId, savedNotification);
    
    return savedNotification;
  }

     async getPendingNotifications(userId: number): Promise<Notification[]> {
    if (this.connectionService.isUserConnected(userId)) {
      return [];
    }
    return this.notificationRepo.find({
      where: {
        userId,
        isRead: false,
        isDelivered: false, 
      },
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }



  async markAsDelivered(id: number) {
  await this.notificationRepo.update(id, { isDelivered: true });
}

async getUnreadCount(userId: number): Promise<number> {
  return this.notificationRepo.count({
    where: {
      userId,
      isRead: false,
    },
  });
}


  async notifyAdmins(message: string) {
    const admins = await this.userRepository.find({
      where: { role: UserRole.ADMIN },
    });

    const notifications = admins.map((admin) =>
      this.notificationRepo.create({
        userId: admin.id,
        message,
        type: 'BOOK_SUBMISSION', 
      }),
    );

    await this.notificationRepo.save(notifications);
  }

 async findAll(userId?: number, page = 1, limit = 10, search?: string) {
  const skip = (page - 1) * limit;

  const query = this.notificationRepo
    .createQueryBuilder('notification')
    .leftJoinAndSelect('notification.user', 'user')
    .orderBy('notification.createdAt', 'DESC')
    .skip(skip)
    .take(limit)
    .select([
      'notification',
      'user.id',
      'user.first_name',
      'user.last_name',
    ]);

  if (userId) {
    // ✅ فلترة حسب userId فقط
    query.andWhere('notification.userId = :userId', { userId });
  }

  if (search) {
    query.andWhere(
      `CONCAT(user.first_name, ' ', user.last_name) LIKE :search`,
      { search: `%${search}%` },
    );
  }

  const [data, total] = await query.getManyAndCount();

  return {
    data,
    total,
    page,
    lastPage: Math.ceil(total / limit),
  };
}




  async markAsRead(id: number) {
    await this.notificationRepo.update(id, { isRead: true });
    return { message: 'تم تعليم الإشعار كمقروء' };
  }


  async deleteMany(ids: number[]): Promise<{ deletedCount: number }> {
  const result = await this.notificationRepo.delete(ids);
  return { deletedCount: result.affected || 0 };
}

}
