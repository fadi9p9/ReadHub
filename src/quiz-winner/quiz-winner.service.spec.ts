import { Test, TestingModule } from '@nestjs/testing';
import { QuizWinnerService } from './quiz-winner.service';

describe('QuizWinnerService', () => {
  let service: QuizWinnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizWinnerService],
    }).compile();

    service = module.get<QuizWinnerService>(QuizWinnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
