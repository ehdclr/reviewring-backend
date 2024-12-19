import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
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
  password?: string;

  @Field(() => String, { nullable: true })
  createdAt?: Date;

  @Field(() => String, { nullable: true })
  updatedAt?: Date;

  @Field(() => String, { nullable: true })
  deletedAt?: Date;
}
