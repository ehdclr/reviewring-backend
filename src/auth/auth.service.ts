import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { LoginInput, LoginResponse } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async login(loginInput: LoginInput): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginInput.email },
    });
    if (!user) {
      throw new GraphQLError('사용자가 존재하지 않습니다.', {
        extensions: {
          code: 'USER_NOT_FOUND',
          status: 404,
        },
      });
    }

    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new GraphQLError('비밀번호가 일치하지 않습니다.', {
        extensions: {
          code: 'INVALID_PASSWORD',
          status: 401,
        },
      });
    }

    const accessToken = this.jwtService.sign({ userId: user.id });
    await this.redisService.set(
      `accessToken:${user.id}`,
      accessToken,
      60 * 60 * 24,
    );
    return {
      accessToken,
      success: true,
      message: '로그인 성공',
      user,
    };
  }
}
