import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, LoginRes } from './dto/login.dto';
import { ApolloError } from 'apollo-server-express';
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginRes)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<LoginRes> {
    try {
      const result = await this.authService.login(loginInput);
      return {
        auth: result,
        message: '로그인 성공',
        success: true,
      };
    } catch (error) {
      throw new ApolloError('로그인 실패', 'INTERNAL_SERVER_ERROR', { error });
    }
  }
}
