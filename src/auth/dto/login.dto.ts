import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@InputType()
export class LoginInput {
  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  password: string;
}

@ObjectType()
export class LoginResponse {
  @Field(() => String)
  accessToken: string;

  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => User)
  user: User;
}
