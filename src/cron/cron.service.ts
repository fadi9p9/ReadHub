import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsersService } from '../user/user.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly userService: UsersService) {}

  @Cron('0 0 * * *')
  async handleDailyCron() {
    this.logger.verbose('جارٍ التحقق من انتهاء الاشتراكات...');
    await this.userService.checkAndEndExpiredSubscriptions();
  }
}