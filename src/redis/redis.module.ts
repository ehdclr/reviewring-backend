import { Module, Global } from '@nestjs/common';
// import { Redis } from '@upstash/redis';
import { Redis } from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS', //redisService에 주입할 이름
      useFactory: () => {
        return new Redis({
          // url: process.env.NODE_ENV === 'production' ? process.env.REDIS_URL : "localhost",
          // token: process.env.REDIS_TOKEN,
          host: 'localhost',
          port: 6379,
        });
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
