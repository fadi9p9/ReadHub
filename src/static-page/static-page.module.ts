import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticPage } from './entities/static-page.entity';
import { StaticPageService } from './static-page.service';
import { StaticPageController } from './static-page.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StaticPage])],
  providers: [StaticPageService],
  controllers: [StaticPageController],
})
export class StaticPageModule {}