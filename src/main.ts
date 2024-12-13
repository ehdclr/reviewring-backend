import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import Redis from 'ioredis';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const RedisStore = connectRedis(session);
  const redisClient = new Redis(process.env.REDIS_URL);

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 10,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
