import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { SignUpUserInput } from './dto/signup-user.input';
import { SignUpUserRes } from './dto/signup-user.res';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  healthCheck(): string {
    return 'Server is running';
  }

  //TODO 회원 조회
  // @Query(() => User)
  // async getUser(@Args('id') id: number): Promise<User> {
  //   return this.userService.getUser(id);
  // }

  @Mutation(() => User)
  async signUp(
    @Args('signUpUserInput') signUpUserInput: SignUpUserInput,
  ): Promise<SignUpUserRes> {
    const user = await this.userService.signUp(signUpUserInput);

    delete user.password; // 비밀번호 제외
    return { user, message: '회원가입 성공', success: true };
  }
}
