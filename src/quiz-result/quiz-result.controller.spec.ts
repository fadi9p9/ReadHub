import { Test, TestingModule } from '@nestjs/testing';
import { QuizResultsController } from './quiz-result.controller';
import { QuizResultsService } from './quiz-result.service';

describe('QuizResultController', () => {
  let controller: QuizResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizResultsController],
      providers: [QuizResultsService],
    }).compile();

    controller = module.get<QuizResultsController>(QuizResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
