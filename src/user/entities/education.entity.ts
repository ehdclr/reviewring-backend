import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class Education {
  @Field(() => Number)
  id?: number;

  @Field(() => User)
  user?: User;

  @Field(() => String)
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String)
  startDate?: string;

  @Field(() => String)
  endDate?: string;

  @Field(() => String)
  degree?: string;

  @Field(() => String)
  major?: string;

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;
}
