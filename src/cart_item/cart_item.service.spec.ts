import { Test, TestingModule } from '@nestjs/testing';
import { CartItemsService } from './cart_item.service';

describe('CartItemService', () => {
  let service: CartItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartItemsService],
    }).compile();

    service = module.get<CartItemsService>(CartItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
