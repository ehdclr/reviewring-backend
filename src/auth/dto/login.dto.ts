import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { Auth } from '../entities/auth.entity';

@InputType()
export class LoginInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

@ObjectType()
export class LoginRes {
  @Field(() => Auth)
  auth: Auth;

  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  success: boolean;
}
