import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { Auth } from './entities/auth.entity';
import { LoginInput } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginInput: LoginInput): Promise<Auth> {
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

    const accessToken = this.jwtService.sign({ id: user.id });
    const refreshToken = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '7d' },
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
