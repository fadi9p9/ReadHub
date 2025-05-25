import { Injectable, NotFoundException } from '@nestjs/common';
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

async findOne(id: number) {
  try {
    const coupon = await this.couponRepository.findOneOrFail({
      where: { id },
      relations: ['winner']
    });
    return coupon;
  } catch (error) {
    throw new NotFoundException(`Coupon with ID ${id} not found`);
  }
}

  update(id: number, updateCouponDto: UpdateCouponDto) {
    return this.couponRepository.save({id, ...updateCouponDto});
  }

 async remove(ids: number[] | number) {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  
  const deleteResult = await this.couponRepository.delete(idsArray);
  
  const affectedRows = deleteResult.affected || 0;
  
  if (affectedRows === 0) {
    throw new NotFoundException(`No coupons found with the provided IDs`);
  }
  
  if (affectedRows < idsArray.length) {
    return { 
      message: `Only ${affectedRows} coupons deleted successfully`, 
      warning: 'Some coupons were not found' 
    };
  }
  
  return { 
    message: `${affectedRows} coupons deleted successfully` 
  };
}

}
