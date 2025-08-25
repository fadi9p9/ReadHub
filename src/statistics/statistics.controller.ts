import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsDto } from './dto/statistics.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  async getStatistics(@Query() statisticsDto: StatisticsDto) {
    if (statisticsDto.userId) {
      const userStats = await this.statisticsService.getUserStatistics(statisticsDto.userId);
      return {
        data: userStats
      };
    }

    const generalStats = await this.statisticsService.getGeneralStatistics();
    return {
      data: generalStats
    };
  }
}