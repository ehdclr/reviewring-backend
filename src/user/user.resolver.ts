import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { SignUpUserInput, SignUpUserRes } from './dto/signup.dto';
import { User } from './entities/user.entity';
import { ApolloError } from 'apollo-server-express';
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
    try {
      const user = await this.userService.getUser(id);
      return user;
    } catch (err) {
      console.log('에러 발생 : 회원조회 실패', err);
      throw new ApolloError(
        'Failed to retrieve user',
        'INTERNAL_SERVER_ERROR',
        {
          status: 500,
          originalError: err.message || err,
        },
      );
    }
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
      throw new ApolloError('회원가입 실패', 'INTERNAL_SERVER_ERROR', {
        status: 500,
        originalError: err.message || err,
      });
    }
  }
}
