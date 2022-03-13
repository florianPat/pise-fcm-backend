import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'POST',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(3005);
}
bootstrap();
