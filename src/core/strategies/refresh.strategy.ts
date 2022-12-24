// Core
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// Tools
import { ENV, STRATEGY } from '../../utils';

// Interfaces
import { JwtPayload, JwtPayloadRefresh } from '../interfaces';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  STRATEGY.REFRESH,
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: <string>config.get(ENV[ENV.JWT_REFRESH]),
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: JwtPayload): JwtPayloadRefresh {
    const refreshToken = request
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}
