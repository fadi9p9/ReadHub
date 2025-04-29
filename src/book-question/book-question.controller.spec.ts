import { Test, TestingModule } from '@nestjs/testing';
import { BookQuestionController } from './book-question.controller';
import { BookQuestionService } from './book-question.service';

describe('BookQuestionController', () => {
  let controller: BookQuestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookQuestionController],
      providers: [BookQuestionService],
    }).compile();

    controller = module.get<BookQuestionController>(BookQuestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
