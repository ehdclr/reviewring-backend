import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { SignUpUserInput, SignUpUserRes } from './dto/signup.dto';
import { User } from './entities/user.entity';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  healthCheck(): string {
    return '헬스 체크 성공';
  }

  //TODO 회원 조회
  @Query(() => User)
  async getUser(@Args('id') id: number): Promise<User> {
    return this.userService.getUser(id);
  }

  @Mutation(() => SignUpUserRes)
  async signUp(
    @Args('signUpUserInput') signUpUserInput: SignUpUserInput,
  ): Promise<SignUpUserRes> {
    try {
      const user = await this.userService.signUp(signUpUserInput);

      delete user.password; // 비밀번호 제외
      return { ...user, message: '회원가입 성공', success: true };
    } catch (err) {
      console.log('에러 발생 : 회원가입 실패', err);
      throw new Error('회원가입 실패');
    }
  }
}
