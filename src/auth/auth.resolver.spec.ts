import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.dto';

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

  it('로그인 성공 resolver 테스트', async () => {
    const loginInput: LoginInput = {
      email: 'test@test.com',
      password: 'plainPassword',
    };

    const mockUser = {
      id: 1,
      email: loginInput.email,
      password: 'hashedPassword',
      name: 'test',
      phone: '01012341234',
      nickname: 'test',
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };

    jest.spyOn(authService, 'login').mockResolvedValue(mockUser as any);
    const result = await resolver.login(loginInput);
    expect(result.auth.accessToken).toBe('mock-access-token');
    expect(result.auth.user).toEqual(mockUser);
    expect(result.message).toBe('로그인 성공');
    expect(result.success).toBe(true);
    expect(authService.login).toHaveBeenCalledWith(loginInput);
  });
});
