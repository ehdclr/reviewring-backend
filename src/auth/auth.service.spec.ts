import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
  });

  describe('login', () => {
    const loginInput = {
      email: 'test@example.com',
      password: 'password123',
    };
    const mockUser = {
      id: 1,
      email: loginInput.email,
      password: 'hashedPassword',
      name: 'test',
      phone: '01012341234',
      nickname: 'test',
      profileImage: 'testurl',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('로그인 성공', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-access-token');

      const result = await service.login(loginInput);
      expect(redisService.set).toHaveBeenCalledWith(
        `accessToken:${mockUser.id}`,
        'Bearer mock-access-token',
        60 * 60 * 24 * 3,
      );
      expect(result.success).toBe(true);
      expect(result.message).toBe('로그인 성공');
      expect(result.accessToken).toBe('mock-access-token');
      expect(result.user).toEqual(mockUser);
    });

    it('이메일이 존재하지 않으면 오류 반환', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      await expect(service.login(loginInput)).rejects.toThrow(
        new GraphQLError('사용자가 존재하지 않습니다.', {
          extensions: {
            code: 'USER_NOT_FOUND',
            status: 404,
          },
        }),
      );
    });

    it('비밀번호가 일치하지 않으면 오류 반환', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));
      await expect(service.login(loginInput)).rejects.toThrow(
        new GraphQLError('비밀번호가 일치하지 않습니다.', {
          extensions: {
            code: 'INVALID_PASSWORD',
            status: 401,
          },
        }),
      );
    });
  });
});
