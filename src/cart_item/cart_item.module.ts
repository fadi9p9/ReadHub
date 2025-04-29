import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart_item.entity';
import { CartItemsService } from './cart_item.service';
import { CartItemController } from './cart_item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],  // إضافة هذا السطر
  controllers: [CartItemController],
  providers: [CartItemsService],
})
export class CartItemModule {}
