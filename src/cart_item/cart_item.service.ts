// src/cart-items/cart-items.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart_item.entity';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  create(createCartItemDto: CreateCartItemDto) {
    const item = this.cartItemRepository.create(createCartItemDto);
    return this.cartItemRepository.save(item);
  }

  findAll() {
    return this.cartItemRepository.find({ relations: ['cart', 'book'] });
  }

  findOne(id: number) {
    return this.cartItemRepository.findOne({ where: { id }, relations: ['cart', 'book'] });
  }

  update(id: number, updateCartItemDto: UpdateCartItemDto) {
    return this.cartItemRepository.update(id, updateCartItemDto);
  }

  remove(id: number) {
    return this.cartItemRepository.delete(id);
  }
}
