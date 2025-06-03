import { Test, TestingModule } from '@nestjs/testing';
import { AuthorProfileController } from './author-profile.controller';
import { AuthorProfileService } from './author-profile.service';

describe('AuthorProfileController', () => {
  let controller: AuthorProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorProfileController],
      providers: [AuthorProfileService],
    }).compile();

    controller = module.get<AuthorProfileController>(AuthorProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
