import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: [
      'https://tevui.com',
      'https://www.tevui.com',
      'http://localhost:3000',
    ],
    methods: ['POST'],
    allowedHeaders: ['Content-Type'],
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
