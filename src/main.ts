// Core
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

// Import App Module
import { AppModule } from './app.module';

// Utils
import { ENV } from './utils';

(async function () {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get(String(ENV.PORT)) ?? 3001;

  await app.listen(port);
  Logger.log(
    `Server has been started on http://localhost:${port}`,
    'NestApplication',
  );
})();
