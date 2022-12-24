// Core
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Tools
import { ENV, STRATEGY } from '../../utils';

// Interfaces
import { JwtPayload } from '../interfaces';

@Injectable()
export class AccessStrategy extends PassportStrategy(
  Strategy,
  STRATEGY.ACCESS,
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: <string>config.get(ENV[ENV.JWT_ACCESS]),
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
