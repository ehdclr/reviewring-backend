import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { LoginInput, LoginResponse } from './dto/login.dto';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    const user = await this.authService.login(loginInput);
    return user;
  }
}
