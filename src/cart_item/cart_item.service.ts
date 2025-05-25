import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.cartItemRepository.save({id,
      ...updateCartItemDto});
  }

 async remove(ids: number[] | number) {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  
  const deleteResult = await this.cartItemRepository.delete(idsArray);
  
  const affectedRows = deleteResult.affected || 0;
  
  if (affectedRows === 0) {
    throw new NotFoundException(`No cartItems found with the provided IDs`);
  }
  
  if (affectedRows < idsArray.length) {
    return { 
      message: `Only ${affectedRows} cartItems deleted successfully`, 
      warning: 'Some cartItems were not found' 
    };
  }
  
  return { 
    message: `${affectedRows} cartItems deleted successfully` 
  };
}

  
}
