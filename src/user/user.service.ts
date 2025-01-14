import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUpUserInput } from './dto/signup.dto';
import { User } from './entities/user.entity';
import { GraphQLError } from 'graphql';
import { UpdateUserInput, UpdateUserResponse } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(user: SignUpUserInput): Promise<User> {
    const hashedPassword = await this.hashPassword(user.password);
    const normalizedEmail = user.email.toLowerCase();
    await this.validateEmail(normalizedEmail);

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

  async getUser(id: number): Promise<User> {
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

  async validateEmail(email: string): Promise<boolean> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        throw new GraphQLError('이미 존재하는 이메일입니다.', {
          extensions: {
            code: 'EMAIL_ALREADY_EXISTS',
            status: 400,
          },
        });
      }

      return true;
    } catch (error) {
      if (error instanceof GraphQLError) throw error;
      throw new GraphQLError('이메일 검증 실패', {
        extensions: {
          code: 'VALIDATION_FAILED',
          status: 500,
          originalError: error.message,
        },
      });
    }
  }

  async validateNickname(nickname: string): Promise<boolean> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { nickname: nickname },
      });
      if (existingUser) {
        throw new GraphQLError('이미 존재하는 닉네임입니다.', {
          extensions: {
            code: 'NICKNAME_ALREADY_EXISTS',
            status: 400,
          },
        });
      }
      return true;
    } catch (error) {
      if (error instanceof GraphQLError) throw error;
      throw new GraphQLError('닉네임 검증 실패', {
        extensions: {
          code: 'VALIDATION_FAILED',
          status: 500,
          originalError: error.message,
        },
      });
    }
  }

  async updateUser(
    id: number,
    user: UpdateUserInput,
  ): Promise<UpdateUserResponse> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!existingUser) {
        throw new GraphQLError('사용자가 존재하지 않습니다.', {
          extensions: {
            code: 'USER_NOT_FOUND',
            status: 404,
          },
        });
      }
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: user,
      });

      return {
        user: updatedUser,
        message: '사용자 업데이트 성공',
        success: true,
      };
    } catch (err) {
      if (err instanceof GraphQLError) throw err;
      throw new GraphQLError('사용자 업데이트 실패', {
        extensions: {
          code: 'VALIDATION_FAILED',
          status: 500,
          originalError: err.message,
        },
      });
    }
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
