import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartItemsService } from './cart_item.service';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemsService) {}

  @Post()
  create(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemService.create(createCartItemDto);
  }

  @Get()
  findAll() {
    return this.cartItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartItemService.update(+id, updateCartItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartItemService.remove(+id);
  }
}
