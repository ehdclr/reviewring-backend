import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { SignUpUserInput } from './dto/signup.dto';
// import { User } from './entities/user.entity';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            signUp: jest.fn(),
            getUser: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  //resolver 정의 확인
  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

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
    expect(result).toEqual({
      id: 1,
      email: 'test@test.com',
      name: 'Test User',
      phone: '010-1234-5678',
      nickname: 'test',
      success: true,
      message: '회원가입 성공',
    });
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

    const errorMessage = '회원가입 실패';
    jest
      .spyOn(userService, 'signUp')
      .mockRejectedValue(new Error(errorMessage));
    jest.spyOn(console, 'log').mockImplementation(() => {});
    await expect(resolver.signUp(createUserInput)).rejects.toThrow(
      errorMessage,
    );
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
    expect(result).toEqual(mockUser);
    expect(userService.getUser).toHaveBeenCalledWith(id);
  });
});
