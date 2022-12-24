// Core
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Request } from 'express';

// Tools
import { LoginDto, SignupDto } from '../core/dtos';
import { AccessGuard, RefreshGuard } from '../core/guards';
import { GetRefreshToken, GetSessionId, GetUsername } from '../core/decorators';

// Service
import { AuthService } from '../use-cases/auth/auth.service';

// Entity
import { UserEntity } from '../core/entities';

// Interfaces
import { EmptyResponse, Tokens } from '../core/interfaces';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignupDto): Promise<UserEntity | HttpException> {
    const account = await this.authService.signup({
      ...dto,
    });
    return account;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() dto: LoginDto,
    @Req() request: Request,
  ): Promise<Tokens | HttpException> {
    return this.authService.login(dto, request);
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetUsername() username: string,
    @GetSessionId() sessionId: string,
    @GetRefreshToken() refreshToken: string,
  ): Promise<Tokens | HttpException> {
    return this.authService.refresh(username, sessionId, refreshToken);
  }

  @Post('logout')
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.OK)
  logout(
    @GetSessionId() sessionId: string,
  ): Promise<EmptyResponse | HttpException> {
    return this.authService.logout(sessionId);
  }
}
