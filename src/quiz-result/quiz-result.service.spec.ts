import { Test, TestingModule } from '@nestjs/testing';
import { QuizResultsService } from './quiz-result.service';

describe('QuizResultService', () => {
  let service: QuizResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizResultsService],
    }).compile();

    service = module.get<QuizResultsService>(QuizResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
