import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
interface ISignUpUser {
  email: string;
  name: string;
  phone: string;
  nickname: string;
  password: string;
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(user: ISignUpUser) {
    return this.prisma.user.create({
      data: user,
    });
  }
}
