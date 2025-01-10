import { Test, TestingModule } from '@nestjs/testing';
import { MentorResolver } from './mentor.resolver';

describe('MentorResolver', () => {
  let resolver: MentorResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MentorResolver],
    }).compile();

    resolver = module.get<MentorResolver>(MentorResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
