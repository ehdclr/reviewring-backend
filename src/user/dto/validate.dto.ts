import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ValidateEmailRes {
  @Field(() => String, { nullable: false })
  message: string;

  @Field(() => Boolean, { nullable: false })
  success: boolean;
}

@ObjectType()
export class ValidateNicknameRes {
  @Field(() => String, { nullable: false })
  message: string;

  @Field(() => Boolean, { nullable: false })
  success: boolean;
}
