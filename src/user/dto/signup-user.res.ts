import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SignUpUserRes {
  @Field(() => Number, { nullable: true })
  id?: number;

  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  nickname: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  success: boolean;
}
