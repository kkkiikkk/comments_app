// Core
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Configurations
import {
  eviromentValidation,
  ServerConfig,
  ConfigOptions,
  DatabaseConfig,
} from './configuration';

// Modules
import { PrismaModule } from './frameworks/services/database/prisma.module';
import { AuthModule } from './use-cases';

// Controllers
import { AuthController } from './controllers';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ServerConfig, DatabaseConfig],
      validationSchema: eviromentValidation,
      validationOptions: ConfigOptions,
    }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AuthController],
})
export class AppModule {}
