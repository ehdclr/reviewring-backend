import { Module } from '@nestjs/common';
import { MentorResolver } from './mentor.resolver';
import { MentorService } from './mentor.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MentorResolver, MentorService],
  exports: [MentorService],
})
export class MentorModule {}
