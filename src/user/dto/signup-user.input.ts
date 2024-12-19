import { InputType, Field } from '@nestjs/graphql';

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
