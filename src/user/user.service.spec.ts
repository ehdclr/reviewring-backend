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

    //TODO 회원조회 실패시
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    await expect(service.getUser(id)).rejects.toThrow(GraphQLError);
  });
});
