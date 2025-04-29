import { Test, TestingModule } from '@nestjs/testing';
import { QuestionAnswersController } from './question-answer.controller';
import { QuestionAnswersService } from './question-answer.service';

describe('QuestionAnswerController', () => {
  let controller: QuestionAnswersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionAnswersController],
      providers: [QuestionAnswersService],
    }).compile();

    controller = module.get<QuestionAnswersController>(QuestionAnswersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
