import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService();
  const origin = configService.getOrThrow<string>('ORIGIN_CORS');
  app.enableCors({
    origin,
    methods: 'GET,PUT,PATCH,POST,DELETE',
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap();
