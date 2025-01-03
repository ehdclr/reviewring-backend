import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { LoginInput, LoginResponse } from './dto/login.dto';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('로그인 성공', async () => {
    const loginInput: LoginInput = {
      email: 'test@test.com',
      password: 'password',
    };

    const loginResponse: LoginResponse = {
      accessToken: 'accessToken',
      message: '로그인 성공',
      user: {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        phone: '010-1234-5678',
        nickname: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      success: true,
    };

    jest.spyOn(authService, 'login').mockResolvedValue(loginResponse as any);
    const result = await resolver.login(loginInput);
    expect(result).toEqual(loginResponse);
    expect(authService.login).toHaveBeenCalledWith(loginInput);
  });

  it('로그인 실패', async () => {
    const loginInput: LoginInput = {
      email: 'test@test.com',
      password: 'password',
    };

    jest
      .spyOn(authService, 'login')
      .mockRejectedValue(new Error('로그인 실패'));
    await expect(resolver.login(loginInput)).rejects.toThrow(Error);
  });

  it('로그인 실패 오류 코드 확인', async () => {
    const loginInput: LoginInput = {
      email: 'test@test.com',
      password: 'password',
    };

    jest
      .spyOn(authService, 'login')
      .mockRejectedValue(new Error('사용자가 존재하지 않습니다.'));
    await expect(resolver.login(loginInput)).rejects.toThrow(Error);
  });
});
