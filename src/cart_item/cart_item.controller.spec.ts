import { Test, TestingModule } from '@nestjs/testing';
import { CartItemController } from './cart_item.controller';
import { CartItemsService } from './cart_item.service';

describe('CartItemController', () => {
  let controller: CartItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemController],
      providers: [CartItemsService],
    }).compile();

    controller = module.get<CartItemController>(CartItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
