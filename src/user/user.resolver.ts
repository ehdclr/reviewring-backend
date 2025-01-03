import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { SignUpUserInput, SignUpUserRes } from './dto/signup.dto';
import { User } from './entities/user.entity';
import { ApolloError } from 'apollo-server-express';
import { ValidateEmailRes } from './dto/validateEmail.dto';
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
        err.message || '회원조회 실패',
        err.extensions.code || 'INTERNAL_SERVER_ERROR',
        {
          status: err.extensions.status || 500,
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
      return {
        ...user,
        message: '회원가입 성공',
        success: true,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (err) {
      console.log('에러 발생 : 회원가입 실패', err);
      throw new ApolloError(
        err.message || '회원가입 실패',
        err.extensions.code || 'INTERNAL_SERVER_ERROR',
        {
          status: err.extensions.status || 500,
          originalError: err.message || err,
        },
      );
    }
  }

  @Mutation(() => ValidateEmailRes)
  async validateEmail(@Args('email') email: string): Promise<ValidateEmailRes> {
    try {
      const result = await this.userService.validateEmail(email);
      return {
        message: '이메일 중복 확인 성공',
        success: result,
      };
    } catch (err) {
      console.log('에러 발생 : 이메일 중복 확인 실패', err);
      throw new ApolloError(
        err.message || '이메일 중복 확인 실패',
        err.extensions.code || 'INTERNAL_SERVER_ERROR',
        {
          status: err.extensions.status || 500,
          originalError: err.message || err,
        },
      );
    }
  }
}
