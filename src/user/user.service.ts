import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUpUserInput } from './dto/signup.dto';
import { User } from './entities/user.entity';
import { GraphQLError } from 'graphql';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(user: SignUpUserInput) {
    const hashedPassword = await this.hashPassword(user.password);
    const normalizedEmail = user.email.toLowerCase();
    await this.validateUserData(normalizedEmail);

    const createdUser = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        name: user.name,
        phone: user.phone,
        nickname: user.nickname,
        password: hashedPassword,
      },
    });
    return createdUser;
  }

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new GraphQLError('사용자가 존재하지 않습니다.', {
        extensions: {
          code: 'USER_NOT_FOUND',
          status: 404,
        },
      });
    }
    const entity = new User();
    entity.id = user.id;
    entity.email = user.email;
    entity.name = user.name;
    entity.phone = user.phone;
    entity.nickname = user.nickname;
    entity.createdAt = user.createdAt;

    return entity;
  }

  private async validateUserData(email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new GraphQLError('이미 존재하는 이메일입니다.', {
        extensions: {
          code: 'EMAIL_ALREADY_EXISTS',
          status: 400,
        },
      });
    }
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
