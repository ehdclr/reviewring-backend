import { Test, TestingModule } from '@nestjs/testing';
import { MentorService } from './mentor.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('MentorService', () => {
  let service: MentorService;
  let prisma: PrismaService;
  const fixedDate = new Date('2024-01-01T00:00:00Z');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MentorService,
        {
          provide: PrismaService,
          useValue: {
            mentor: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MentorService>(MentorService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('멘토 등록', () => {
    it('멘토 등록 성공', async () => {
      const mockMentor = {
        id: 1,
        userId: 1,
        description: 'test',
        services: [],
        schedules: [],
        unavailable: [],
        createdAt: fixedDate,
        updatedAt: fixedDate,
      };
    });
  })
});
