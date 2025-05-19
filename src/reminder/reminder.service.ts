// src/reminder/reminder.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsersService } from '../user/user.service';
import { MailService } from '../auth/mail/mail.service'; // المسار الصحيح
import * as moment from 'moment';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  @Cron('0 8 * * *') 
  // @Cron('*/30 * * * * *')
  async remindInactiveUsers() {
    const sevenDaysAgo = moment().subtract(7, 'days').toDate();
    // const sevenDaysAgo = moment().subtract(1, 'hours').toDate();

    const inactiveUsers = await this.usersService.findInactiveSince(sevenDaysAgo);

    this.logger.log(`عدد المستخدمين غير النشطين: ${inactiveUsers.length}`);

    for (const user of inactiveUsers) {
      if (!user.email.includes('@gmail.com')) {
    continue;}
      await this.mailService.sendReminderEmail(user.email, user.first_name);
    }
  }
}
