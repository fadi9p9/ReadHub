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

  async remove(id: number) {
  const result = await this.couponRepository.delete(id);
  
  if (result.affected === 0) {
    throw new NotFoundException(`Coupon with ID ${id} not found`);
  }
  
  return { message: 'Coupon deleted successfully' };
}
}
