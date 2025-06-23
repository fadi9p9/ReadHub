import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateNotificationDto) {
    const notification = this.notificationRepo.create(dto);
    return this.notificationRepo.save(notification);
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
