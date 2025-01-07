import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class GetUserResponse {
  @Field(() => User)
  user: User;

  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  success: boolean;
}
