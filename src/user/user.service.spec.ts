import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;
  let redis: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              signUp: jest.fn(),
            },
          },
        },
        {
          provide: RedisService,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    redis = module.get<RedisService>(RedisService);
  });

  //데이터 초기화
  afterEach(async () => {
    await prisma.user.deleteMany();
    jest.clearAllMocks();
  });

  it('회원가입 성공', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      password: 'test',
      name: 'test',
      phone: '010-1234-5678',
      nickname: 'test',
    };

    jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser as any);

    const result = await service.signUp(mockUser);

    expect(result).toEqual(mockUser);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: mockUser,
    });
  });

});