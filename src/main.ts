import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix('/api/v1');
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.use(cookieParser());

  await app.listen(port);
}
bootstrap();
