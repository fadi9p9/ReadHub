import { Test, TestingModule } from '@nestjs/testing';
import { PendingBooksController } from './pending-book.controller';
import { PendingBooksService } from './pending-book.service';

describe('PendingBookController', () => {
  let controller: PendingBooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PendingBooksController],
      providers: [PendingBooksService],
    }).compile();

    controller = module.get<PendingBooksController>(PendingBooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
