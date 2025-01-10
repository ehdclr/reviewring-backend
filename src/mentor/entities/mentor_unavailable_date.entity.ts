import { Field, ObjectType } from '@nestjs/graphql';
import { Mentor } from './mentor.entity';

@ObjectType()
export class MentorUnavailableDate {
  @Field(() => Number)
  id?: number;

  @Field(() => Mentor)
  mentor?: Mentor;

  @Field(() => String)
  startTime?: string;

  @Field(() => String)
  endTime?: string;

  @Field(() => String, { nullable: true })
  reason?: string;

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;
}
