// Core
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as Argon from 'argon2';
import { User, Session } from '@prisma/client';

// Errors
import { MESSAGES } from '../errors';

// Prisma
import { PrismaService } from '../../frameworks/services/database/prisma.service';

// Tools
import { SignupDto } from '../dtos';

export class UserClass {
  constructor(private User: User) {
    if (!User) {
      throw new NotFoundException(MESSAGES.USER_NOT);
    }
  }

  public async checkPassword(password: string): Promise<this> {
    if (!(await Argon.verify(this.User.password, password))) {
      throw new UnauthorizedException(MESSAGES.PASSWORD_WRONG);
    }

    return this;
  }

  static async createUser(
    prisma: PrismaService,
    dto: SignupDto,
  ): Promise<User> {
    const password = await Argon.hash(dto.password);
    return prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        username: dto.username,
        password,
      },
    });
  }

  static async checkUsername(
    prisma: PrismaService,
    username: string,
  ): Promise<NotFoundException | void> {
    const User = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (User) {
      throw new ConflictException(MESSAGES.USERNAME_TAKEN);
    }
  }

  static async checkEmail(
    prisma: PrismaService,
    email: string,
  ): Promise<NotFoundException | void> {
    const User = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (User) {
      throw new ConflictException(MESSAGES.EMAIL_TAKEN);
    }
  }

  static async updateToken(
    prisma: PrismaService,
    id: string,
    token: string,
  ): Promise<void> {
    const tokenHash = await Argon.hash(token);
    await prisma.session.update({
      where: {
        id,
      },
      data: {
        tokenHash,
      },
    });
  }

  static async createSession(
    prisma: PrismaService,
    id: string,
    userId: string,
    token: string,
    ip: string,
    device: string,
  ): Promise<Session> {
    const tokenHash = await Argon.hash(token);
    return prisma.session.create({
      data: {
        id,
        ip,
        device,
        tokenHash,
        userId,
      },
    });
  }

  static async deleteSession(prisma: PrismaService, id: string): Promise<void> {
    await prisma.session.delete({
      where: {
        id,
      },
    });
  }
}
