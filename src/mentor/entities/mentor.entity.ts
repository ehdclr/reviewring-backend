import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { MentorService } from './mentor_service.entity';

@ObjectType()
export class Mentor {
  @Field(() => Number)
  id?: number;

  @Field(() => User)
  user?: User;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [MentorService])
  services?: MentorService[];

  @Field(() => [MentorSchedule])
  schedules?: MentorSchedule[];

  @Field(() => [MentorUnavailable])
  unavailable?: MentorUnavailable[];

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;
}
