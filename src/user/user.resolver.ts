import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { SignUpUserInput } from './dto/signup-user.input';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  healthCheck(): string {
    return 'Server is running';
  }

  @Mutation(() => User)
  async signUp(
    @Args('signUpUserInput') signUpUserInput: SignUpUserInput,
  ): Promise<User> {
    const user = await this.userService.signUp(signUpUserInput);

    delete user.password;
    return user;
  }
}
