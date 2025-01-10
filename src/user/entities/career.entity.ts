import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class Career {
  @Field(() => Number)
  id?: number;

  @Field(() => User)
  user?: User;

  @Field(() => String)
  name?: string;

  @Field(() => String, { nullable: true })
  position?: string;

  @Field(() => String)
  description?: string;

  @Field(() => String)
  startDate?: string;

  @Field(() => String)
  endDate?: string;

  @Field(() => Boolean)
  isCurrent?: boolean;

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;
}
