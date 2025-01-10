import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DayOfWeek {
  @Field(() => Number)
  id?: number;

  @Field(() => String)
  name?: string;
}
