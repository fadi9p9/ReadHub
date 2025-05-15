import { Test, TestingModule } from '@nestjs/testing';
import { QuizWinnersService } from './quiz-winner.service';

describe('QuizWinnerService', () => {
  let service: QuizWinnersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizWinnersService],
    }).compile();

    service = module.get<QuizWinnersService>(QuizWinnersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
