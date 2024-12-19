import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class SignUpUserRes {
  @Field(() => User)
  user: User; // 기존 리터럴 대신 User 타입 사용

  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  success: boolean;
}
