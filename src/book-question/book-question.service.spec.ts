import { Test, TestingModule } from '@nestjs/testing';
import { BookQuestionsService } from './book-question.service';

describe('BookQuestionService', () => {
  let service: BookQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookQuestionsService],
    }).compile();

    service = module.get<BookQuestionsService>(BookQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
