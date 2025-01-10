import { Module } from '@nestjs/common';
import { MentorResolver } from './mentor.resolver';
import { MentorService } from './mentor.service';

@Module({
  providers: [MentorResolver, MentorService]
})
export class MentorModule {}
