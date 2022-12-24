// Core
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Request } from 'express';
import * as Argon from 'argon2';

// Prisma
import { PrismaService } from '../../frameworks/services/database/prisma.service';

// Tools
import { LoginDto, SignupDto } from '../../core/dtos';
import { UserEntity } from '../../core/entities';
import { ENV, getUUID } from '../../utils';
import { UserClass } from '../../core/classes/user.class';

// Interfaces
import { EmptyResponse, JwtPayload, Tokens } from '../../core/interfaces';

// Erros
import { MESSAGES } from '../../core/errors';

@Injectable()
export class AuthService {
  private readonly JwtAccessExpireTime = '1h';

  private readonly JwtRefreshExpireTime = '1d';

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto): Promise<UserEntity | HttpException> {
    await UserClass.checkUsername(this.prisma, dto.username);
    await UserClass.checkEmail(this.prisma, dto.email);
    return new UserEntity(await UserClass.createUser(this.prisma, dto));
  }

  async login(
    dto: LoginDto,
    request: Request,
  ): Promise<Tokens | HttpException> {
    const User = <User>await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    const controller = new UserClass(User);
    await controller.checkPassword(dto.password);

    const sessionId = getUUID();
    const tokens = await this.generateTokens({
      id: User.id,
      email: User.email,
      username: User.username,
      sessionId,
    });

    await UserClass.createSession(
      this.prisma,
      sessionId,
      User.id,
      tokens.refresh_token,
      request.ip,
      request.headers['user-agent'] || '',
    );

    return tokens;
  }

  async refresh(
    username: string,
    id: string,
    token: string,
  ): Promise<Tokens | HttpException> {
    const User = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        session: {
          where: {
            id,
          },
        },
      },
    });

    if (!User?.session[0]) {
      throw new ForbiddenException(MESSAGES.ACCESS_DENIED);
    }

    if (!(await Argon.verify(User?.session[0].tokenHash, token))) {
      throw new ForbiddenException(MESSAGES.ACCESS_DENIED);
    }

    const tokens = await this.generateTokens({
      id: <string>User?.id,
      email: <string>User?.email,
      username: <string>User?.username,
      sessionId: <string>User?.session[0].id,
    });

    await UserClass.updateToken(this.prisma, id, tokens.refresh_token);

    return tokens;
  }

  async logout(sessionId: string): Promise<EmptyResponse> {
    const session = await this.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });
    if (!session) {
      throw new ForbiddenException(MESSAGES.ACCESS_DENIED);
    }
    await UserClass.deleteSession(this.prisma, sessionId);

    return {};
  }

  private async generateTokens(payload: JwtPayload): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>(ENV[ENV.JWT_ACCESS]),
        expiresIn: this.JwtAccessExpireTime,
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>(ENV[ENV.JWT_REFRESH]),
        expiresIn: this.JwtRefreshExpireTime,
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}
