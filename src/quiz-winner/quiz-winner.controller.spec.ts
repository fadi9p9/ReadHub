import { Test, TestingModule } from '@nestjs/testing';
import { QuizWinnerController } from './quiz-winner.controller';
import { QuizWinnerService } from './quiz-winner.service';

describe('QuizWinnerController', () => {
  let controller: QuizWinnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizWinnerController],
      providers: [QuizWinnerService],
    }).compile();

    controller = module.get<QuizWinnerController>(QuizWinnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
