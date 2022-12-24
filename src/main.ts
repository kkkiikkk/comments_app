// Core
import { NestFactory } from '@nestjs/core';

// Import App Module
import { AppModule } from './app.module';

(async function () {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
})();
