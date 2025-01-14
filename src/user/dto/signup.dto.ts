import { InputType, Field, ObjectType } from '@nestjs/graphql';

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

  @Field(() => String, { nullable: true, defaultValue: 'USER' })
  role?: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isActiveMentor?: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isActiveMentee?: boolean;
}

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

  @Field(() => String, { nullable: true })
  profileImage?: string;

  @Field(() => String, { nullable: true, defaultValue: '' })
  description?: string;

  @Field(() => String, { nullable: true, defaultValue: 'USER' })
  role?: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isActiveMentor?: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isActiveMentee?: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  success: boolean;
}
