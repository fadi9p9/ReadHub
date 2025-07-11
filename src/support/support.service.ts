import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { SupportMessage } from './entities/support-message.entity/support-message.entity';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportMessage)
    private readonly messageRepo: Repository<SupportMessage>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getMessages(userId: number): Promise<SupportMessage[]> {
    return this.messageRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }



 async saveMessage(userId: number, message: string, from: 'user' | 'admin'): Promise<SupportMessage> {
  // تحقق من وجود المستخدم مع معالجة الأخطاء المحسنة
  const user = await this.userRepo.findOne({ 
    where: { id: userId },
    select: ['id', 'first_name', 'last_name', 'email']
  });
  
  if (!user) {
    throw new Error('المستخدم غير موجود');
  }

  // تحقق من صحة الرسالة
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw new Error('الرسالة لا يمكن أن تكون فارغة');
  }

  // بدء معاملة لضمان سلامة البيانات
  return this.messageRepo.manager.transaction(async transactionalEntityManager => {
    const newMessage = this.messageRepo.create({
      user,
      message: message.trim(),
      from
    });

    const savedMessage = await transactionalEntityManager.save(newMessage);
    
    // تحديث تاريخ آخر نشاط للمستخدم
    await transactionalEntityManager.update(
      User, 
      userId, 
      { last_login_at: new Date() }
    );

    return savedMessage;
  });
}

  async getUsersWithMessages(): Promise<User[]> {
    const messages = await this.messageRepo.find({
      relations: ['user'],
      select: ['user'],
    });

    const uniqueUsers = new Map<number, User>();
    messages.forEach(msg => {
      if (msg.user && !uniqueUsers.has(msg.user.id)) {
        uniqueUsers.set(msg.user.id, msg.user);
      }
    });

    return Array.from(uniqueUsers.values());
  }
}