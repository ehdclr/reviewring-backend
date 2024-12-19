import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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
    const hashedPassword = await this.hashPassword(user.password);
    const normalizedEmail = user.email.toLowerCase();
    await this.validateUserData(normalizedEmail);
    return this.prisma.user.create({
      data: {
        email: normalizedEmail,
        name: user.name,
        phone: user.phone,
        nickname: user.nickname,
        password: hashedPassword,
      },
    });
  }

  private async validateUserData(email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
