import { Field, ObjectType } from '@nestjs/graphql';
import { Mentor } from './mentor.entity';

@ObjectType()
export class MentorService {
  @Field(() => Number)
  id?: number;

  @Field(() => Mentor)
  mentor?: Mentor;

  @Field(() => String)
  name?: string;

  @Field(() => Number)
  price?: number;

  @Field(() => String)
  currency?: string;

  @Field(() => String)
  moneyDescription?: string;

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;
}
