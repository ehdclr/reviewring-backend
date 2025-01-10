import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Skill {
  @Field(() => Number)
  id?: number;

  @Field(() => String)
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;
}
