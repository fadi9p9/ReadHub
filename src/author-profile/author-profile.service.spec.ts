import { Test, TestingModule } from '@nestjs/testing';
import { AuthorProfileService } from './author-profile.service';

describe('AuthorProfileService', () => {
  let service: AuthorProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorProfileService],
    }).compile();

    service = module.get<AuthorProfileService>(AuthorProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
