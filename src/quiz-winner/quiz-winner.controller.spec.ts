import { Test, TestingModule } from '@nestjs/testing';
import { QuizWinnersController } from './quiz-winner.controller';
import { QuizWinnersService } from './quiz-winner.service';

describe('QuizWinnerController', () => {
  let controller: QuizWinnersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizWinnersController],
      providers: [QuizWinnersService],
    }).compile();

    controller = module.get<QuizWinnersController>(QuizWinnersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
