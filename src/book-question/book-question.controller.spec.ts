import { Test, TestingModule } from '@nestjs/testing';
import { BookQuestionsController } from './book-question.controller';
import { BookQuestionsService } from './book-question.service';

describe('BookQuestionController', () => {
  let controller: BookQuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookQuestionsController],
      providers: [BookQuestionsService],
    }).compile();

    controller = module.get<BookQuestionsController>(BookQuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
