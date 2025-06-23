import { Test, TestingModule } from '@nestjs/testing';
import { PendingBooksService } from './pending-book.service';

describe('PendingBookService', () => {
  let service: PendingBooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingBooksService],
    }).compile();

    service = module.get<PendingBooksService>(PendingBooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
