import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
@InputType()
export class SignUpUserInput {
  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  phone: string;

  @Field(() => String, { nullable: false })
  nickname: string;

  @Field(() => String, { nullable: false })
  password: string;
}

@ObjectType()
export class SignUpUserRes {
  @Field(() => User)
  user: Omit<User, 'password'>;

  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  success: boolean;
}
