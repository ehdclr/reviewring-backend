import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignUpUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  nickname: string;

  @Field(() => String)
  password: string;
}
