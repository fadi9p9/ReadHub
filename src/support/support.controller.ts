import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @UseGuards(JwtAuthGuard)
  @Get('messages')
  async getMessages(@Query('userId') userId: number) {
    return this.supportService.getMessages(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsersWithMessages() {
    return this.supportService.getUsersWithMessages();
  }
}