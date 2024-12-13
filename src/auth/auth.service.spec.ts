import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let redis: RedisService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, RedisService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    redis = module.get<RedisService>(RedisService);
    // 테스트 데이터 초기화
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('회원가입 성공', async () => {
    const user = await service.signUp({
      email: 'test@test.com',
      password: '12341234',
      name: 'test',
      phone: '01012345678',
      nickname: 'test',
    });

    expect(user).toBeDefined();
    expect(user.email).toEqual('test@test.com');
    expect(user.name).toEqual('test');
    expect(user.phone).toEqual('01012345678');
    expect(user.nickname).toEqual('test');
  });

  it('이메일은 unique 해야 합니다.', async () => {
    await expect(
      service.signUp({
        email: 'test@test.com',
        password: '12341234',
        name: 'test',
        phone: '01012345678',
        nickname: 'test',
      }),
    ).rejects.toThrow();
  });
});
