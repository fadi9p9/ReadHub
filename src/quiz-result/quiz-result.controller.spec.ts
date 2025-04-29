import { Test, TestingModule } from '@nestjs/testing';
import { QuizResultController } from './quiz-result.controller';
import { QuizResultService } from './quiz-result.service';

describe('QuizResultController', () => {
  let controller: QuizResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizResultController],
      providers: [QuizResultService],
    }).compile();

    controller = module.get<QuizResultController>(QuizResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
