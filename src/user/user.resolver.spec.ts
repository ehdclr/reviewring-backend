import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { SignUpUserInput } from './dto/signup-user.input';
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
    const errorMessage = 'Sign up failed';
    jest
      .spyOn(userService, 'signUp')
      .mockRejectedValue(new Error(errorMessage));

    // Act & Assert
    await expect(resolver.signUp(createUserInput)).rejects.toThrow(
      errorMessage,
    );
    expect(userService.signUp).toHaveBeenCalledWith(createUserInput);
  });
});
