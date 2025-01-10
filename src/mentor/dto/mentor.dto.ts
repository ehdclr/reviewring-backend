import { Field, ObjectType, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMentorInput {
  @Field(() => [String])
  categories: string[];

  @Field(() => String)
  description: string;

  @Field(() => [String])
  services: string[];

  @Field(() => [String])
  schedules: string[];

  @Field(() => [String])
  unavailable: string[];
}

@ObjectType()
export class CreateMentorResponse {
  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  success: boolean;
}
