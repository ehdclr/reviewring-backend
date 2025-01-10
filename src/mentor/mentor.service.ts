import { Injectable } from '@nestjs/common';

@Injectable()
export class MentorService {
  constructor(private readonly prisma: PrismaService) {}

  //@ 멘토 등록 
  async createMentor(userId: number) {
    const mentor = await this.prisma.mentor.create({
      data: {
        userId,
      },
    });
  }
}
