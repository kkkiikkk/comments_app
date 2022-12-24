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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ServerConfig, DatabaseConfig],
      validationSchema: eviromentValidation,
      validationOptions: ConfigOptions,
    }),
    PrismaModule,
  ],
})
export class AppModule {}
