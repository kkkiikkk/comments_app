// Core
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// Controllers
import { AuthController } from '../../controllers';

// Service
import { AuthService } from './auth.service';

// Tools
import { AccessStrategy, RefreshStrategy } from '../../core/strategies';
import { AccessGuard, RefreshGuard } from '../../core/guards';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessStrategy,
    RefreshStrategy,
    AccessGuard,
    RefreshGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
