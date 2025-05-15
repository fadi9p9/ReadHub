import { Test, TestingModule } from '@nestjs/testing';
import { QuizzesController } from './quiz.controller';
import { QuizzesService } from './quiz.service';

describe('QuizController', () => {
  let controller: QuizzesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizzesController],
      providers: [QuizzesService],
    }).compile();

    controller = module.get<QuizzesController>(QuizzesController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
