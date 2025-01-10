import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { SignUpUserInput } from './dto/signup.dto';
import { GraphQLError } from 'graphql';
import { ApolloError } from 'apollo-server-express';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-07T04:25:12.637Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            signUp: jest.fn(),
            getUser: jest.fn(),
            validateEmail: jest.fn(),
            validateNickname: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('회원가입 테스트', () => {
    it('회원가입 성공 resolver 테스트', async () => {
      const createUserInput: SignUpUserInput = {
        email: 'test@test.com',
        name: 'Test User',
        phone: '010-1234-5678',
        nickname: 'test',
        password: 'plainPassword',
      };

      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        phone: '010-1234-5678',
        nickname: 'test',
        success: true,
        message: '회원가입 성공',
      };

      jest.spyOn(userService, 'signUp').mockResolvedValue(mockUser as any);
      const result = await resolver.signUp(createUserInput);
      expect(result).toEqual(mockUser);
      expect(userService.signUp).toHaveBeenCalledWith(createUserInput);
    });

    it('회원가입 실패 resolver 테스트', async () => {
      const createUserInput: SignUpUserInput = {
        email: 'test@test.com',
        name: 'Test User',
        phone: '010-1234-5678',
        nickname: 'test',
        password: 'plainPassword',
      };

      const error = new GraphQLError('회원가입 실패', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          status: 500,
        },
      });

      jest.spyOn(userService, 'signUp').mockRejectedValue(error);
      await expect(resolver.signUp(createUserInput)).rejects.toThrow(
        ApolloError,
      );
    });
  });

  describe('이메일 중복 확인 테스트', () => {
    it('이메일 중복 확인 성공 resolver 테스트', async () => {
      const email = 'test@test.com';
      jest.spyOn(userService, 'validateEmail').mockResolvedValue(true);
      const result = await resolver.validateEmail(email);
      expect(result).toEqual({
        message: '이메일 중복 확인 성공',
        success: true,
      });
      expect(userService.validateEmail).toHaveBeenCalledWith(email);
    });

    it('이메일 중복 확인 실패 resolver 테스트', async () => {
      const error = new GraphQLError('이미 존재하는 이메일입니다.', {
        extensions: {
          code: 'EMAIL_ALREADY_EXISTS',
          status: 400,
        },
      });

      jest.spyOn(userService, 'validateEmail').mockRejectedValue(error);

      try {
        await resolver.validateEmail('test@test.com');
        fail('이메일 중복 확인 실패 테스트 실패');
      } catch (err) {
        expect(err).toBeInstanceOf(ApolloError);
        expect(err.message).toBe('이미 존재하는 이메일입니다.');
        expect(err.extensions.code).toBe('EMAIL_ALREADY_EXISTS');
        expect(err.extensions.status).toBe(400);
      }
    });
  });

  it('회원 조회 성공 resolver 테스트', async () => {
    const id = 1;
    const mockUser = {
      id,
      email: 'test@test.com',
      name: 'Test User',
      phone: '010-1234-5678',
      nickname: 'test',
      createdAt: new Date(),
    };

    jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser as any);
    const result = await resolver.getUser(id);

    expect(result).toEqual({
      message: '회원 조회 성공',
      success: true,
      user: mockUser,
    });
    expect(userService.getUser).toHaveBeenCalledWith(id);
  });

  describe('닉네임 중복확인', () => {
    it('닉네임 중복확인 성공', async () => {
      const nickname = 'test';
      jest.spyOn(userService, 'validateNickname').mockResolvedValue(true);
      const result = await resolver.validateNickname(nickname);
      expect(result).toEqual({
        message: '닉네임 중복 확인 성공',
        success: true,
      });
      expect(userService.validateNickname).toHaveBeenCalledWith(nickname);
    });
  });

  describe('회원 조회', () => {
    it('회원 조회 성공', async () => {
      const id = 1;

      const mockUser = {
        id,
        email: 'test@test.com',
        name: 'Test User',
        phone: '010-1234-5678',
        nickname: 'test',
        createdAt: new Date().toISOString(),
      };

      jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser as any);
      const result = await resolver.getUser(id);
      expect(result).toEqual({
        message: '회원 조회 성공',
        success: true,
        user: mockUser,
      });
      expect(userService.getUser).toHaveBeenCalledWith(id);
    });
  });
});
