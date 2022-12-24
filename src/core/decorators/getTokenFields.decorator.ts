// Core
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Interfaces
import { JwtPayload, JwtPayloadRefresh } from '../interfaces';

export const GetSessionId = createParamDecorator(
  (data: keyof JwtPayload | undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.user.sessionId;
  },
);

export const GetAccountId = createParamDecorator(
  (data: keyof JwtPayload | undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.user.id;
  },
);

export const GetUsername = createParamDecorator(
  (data: keyof JwtPayload | undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.user.username;
  },
);

export const GetRefreshToken = createParamDecorator(
  (
    data: keyof JwtPayloadRefresh | undefined,
    context: ExecutionContext,
  ): string => {
    const request = context.switchToHttp().getRequest();
    return request.user.refreshToken;
  },
);
