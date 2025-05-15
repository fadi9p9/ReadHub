import { Module } from '@nestjs/common';
import { CouponsService } from './coupon.service';
import { CouponsController } from './coupon.controller';
import { Coupon } from './entities/coupon.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon,User])],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponModule {}
