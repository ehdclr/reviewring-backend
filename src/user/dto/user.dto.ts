import { ObjectType, Field, InputType } from '@nestjs/graphql';
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

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  nickname?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  profileImage?: string;
}

@ObjectType()
export class UpdateUserResponse {
  @Field(() => User)
  user: User;

  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  success: boolean;
}
