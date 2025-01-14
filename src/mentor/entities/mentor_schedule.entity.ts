import { Field, ObjectType } from '@nestjs/graphql';
import { DayOfWeek } from 'src/common/entities/dayofweek.entity';
import { Mentor } from './mentor.entity';

@ObjectType()
export class MentorSchedule {
  @Field(() => Number)
  id?: number;

  @Field(() => Mentor)
  mentor?: Mentor;

  @Field(() => String)
  startTime?: string;

  @Field(() => String)
  endTime?: string;

  @Field(() => [DayOfWeek])
  daysOfWeek?: DayOfWeek[];

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;
}
