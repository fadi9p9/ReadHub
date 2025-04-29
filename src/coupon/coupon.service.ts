// src/coupons/coupons.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  create(createCouponDto: CreateCouponDto) {
    const coupon = this.couponRepository.create(createCouponDto);
    return this.couponRepository.save(coupon);
  }

  findAll() {
    return this.couponRepository.find();
  }

  findOne(id: number) {
    return this.couponRepository.findOneBy({ id });
  }

  update(id: number, updateCouponDto: UpdateCouponDto) {
    return this.couponRepository.update(id, updateCouponDto);
  }

  remove(id: number) {
    return this.couponRepository.delete(id);
  }
}
