import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Number)
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

  @Field(() => String)
  password?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true, defaultValue: 'USER' })
  role?: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isActiveMentor?: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isActiveMentee?: boolean;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  @Field(() => Date)
  deletedAt?: Date;
}
