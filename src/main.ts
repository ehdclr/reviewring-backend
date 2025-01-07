import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 로거 인터셉터 생성

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
