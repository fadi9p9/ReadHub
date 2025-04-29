// src/carts/carts.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async create(createCartDto: CreateCartDto) {
    const cart = this.cartRepository.create({
      user: { id: createCartDto.userId  }, 
      items: createCartDto.items?.map(itemId => ({ id: itemId })) 
    });
    return this.cartRepository.save(cart);
  }

  findAll() {
    return this.cartRepository.find({ relations: ['favorites', 'cart_items'] });
  }

  findOne(id: number) {
    return this.cartRepository.findOne({ where: { id }, relations: ['favorites', 'cart_items'] });
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    const updateData: any = {
      ...(updateCartDto.userId && { user: { id: updateCartDto.userId } }),
      ...(updateCartDto.items && { 
        items: updateCartDto.items.map(itemId => ({ id: itemId })) 
      })
    };
  
    await this.cartRepository.update(id, updateData);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.cartRepository.delete(id);
  }
}
