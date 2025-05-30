import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
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

  async findAll(filterStatus?: string) {
  const options: FindManyOptions<Cart> = {
    relations: ['user'],
    select: {
      id: true,
      created_at: true,
      updated_at: true,
      status: true,
      user: {
        id: true,
        email: true,
      },
    },
  };

  if (filterStatus) {
    options.where = { status: filterStatus };
  }

  return this.cartRepository.find(options);
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
      updated_at:true,
      status: true,
      user: {
        id: true,
        email: true,
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
      ...(updateCartDto.status && { status: updateCartDto.status }),
      ...(updateCartDto.userId && { user: { id: updateCartDto.userId } }),
      ...(updateCartDto.items && { 
        items: updateCartDto.items.map(itemId => ({ id: itemId })) 
      })
    };
  
    await this.cartRepository.save({id, updateData, status: updateCartDto.status });
    return this.findOne(id);
  }

async remove(ids: number[] | number) {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  
  const deleteResult = await this.cartRepository.delete(idsArray);
  
  const affectedRows = deleteResult.affected || 0;
  
  if (affectedRows === 0) {
    throw new NotFoundException(`No carts found with the provided IDs`);
  }
  
  if (affectedRows < idsArray.length) {
    return { 
      message: `Only ${affectedRows} carts deleted successfully`, 
      warning: 'Some carts were not found' 
    };
  }
  
  return { 
    message: `${affectedRows} carts deleted successfully` 
  };
}
}
