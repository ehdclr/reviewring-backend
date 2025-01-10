import { Mentor } from "./mentor.entity";

export class MentorSchedule {
  @Field(() => Number)
  id?: number;

  @Field(() => Mentor)
  mentor?: Mentor;

  @Field(() => String)
  startTime?: string;

  @Field(() => String)
  endTime?: string;

  @Field(() => [MentorScheduleDay])
  daysOfWeek?: MentorScheduleDay[];

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;
}
