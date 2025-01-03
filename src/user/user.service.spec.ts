import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              validateEmail: jest.fn(),
              validateNickname: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Mock 상태 초기화
  });

  it('회원가입 성공', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      password: 'hashedPassword',
      name: 'test',
      phone: '010-1234-5678',
      nickname: 'test',
    };

    // Mock 설정
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null); // 중복 이메일 없음
    jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser as any); // 사용자 생성
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockUser.password); // 비밀번호 해싱

    // 테스트 실행
    const result = await service.signUp({
      email: mockUser.email,
      name: mockUser.name,
      phone: mockUser.phone,
      nickname: mockUser.nickname,
      password: 'plainPassword', // 원본 비밀번호
    });

    // 결과 검증
    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockUser.email.toLowerCase() },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: mockUser.email.toLowerCase(),
        name: mockUser.name,
        phone: mockUser.phone,
        nickname: mockUser.nickname,
        password: 'hashedPassword', // 해싱된 비밀번호
      },
    });
  });

  it('회원 조회 성공', async () => {
    const id = 1;
    const mockUser = {
      id,
      email: 'test@test.com',
      name: 'Test User',
      phone: '010-1234-5678',
      nickname: 'test',
      createdAt: new Date(),
    };
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
    const result = await service.getUser(id);
    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id },
    });

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    await expect(service.getUser(id)).rejects.toThrow(GraphQLError);
  });

  it('이메일 중복 확인 성공', async () => {
    const email = 'test@test.com';
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    const result = await service.validateEmail(email);
    expect(result).toBe(true);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: email.toLowerCase() },
    });

    const mockUser = {
      id: 1,
      email: email,
      name: 'Test User',
      phone: '010-1234-5678',
      nickname: 'test',
      createdAt: new Date(),
    };
    // 이메일로 사용자 찾았을 때 존재하면안됨
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
    await expect(service.validateEmail(email)).rejects.toThrow(GraphQLError);
  });

  describe('닉네임 중복확인', () => {
    it('닉네임 중복확인 성공', async () => {
      const nickname = 'test';
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      const result = await service.validateNickname(nickname);

      expect(result).toBe(true);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { nickname },
      });

      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        phone: '010-1234-5678',
        nickname: nickname,
        createdAt: new Date(),
      };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any); // 이미 존재하는 닉네임
      await expect(service.validateNickname(nickname)).rejects.toThrow(
        GraphQLError,
      );
    });
  });
});
