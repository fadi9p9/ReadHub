import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll() {
  return this.cartRepository.find({
    relations: ['user', 'items'],
    select: {
      id: true,
      created_at: true,
      user: {
        id: true,
      },
      items: {
        id: true,
        quantity: true,
        book: {
          id: true,
        },
      },
    }
  });
}

 async findOne(id: number) {
  const cart = await this.cartRepository.findOne({
    where: { id },
    relations: {
      user: true,
      items: {
        book: true
      }
    },
    select: {
      id: true,
      created_at: true,
      user: {
        id: true,
      },
      items: {
        id: true,
        quantity: true,
        book: {
          id: true,
          title: true, 
          price: true
        }
      }
    },
    withDeleted: false 
  });

  if (!cart) {
    throw new NotFoundException(`Cart with ID ${id} not found`);
  }
  return {
    ...cart,
    items: cart.items.map(item => ({
      ...item,
    }))
  };
}

  async update(id: number, updateCartDto: UpdateCartDto) {
    const updateData: any = {
      ...(updateCartDto.userId && { user: { id: updateCartDto.userId } }),
      ...(updateCartDto.items && { 
        items: updateCartDto.items.map(itemId => ({ id: itemId })) 
      })
    };
  
    await this.cartRepository.save({id, updateData});
    return this.findOne(id);
  }

 async remove(id: number) {
    const result= this.cartRepository.delete(id);
   if ((await result).affected === 0) {
    throw new NotFoundException(`cart with ID ${id} not found`);
  }
  
  return { message: 'cart deleted successfully' };
}
}
