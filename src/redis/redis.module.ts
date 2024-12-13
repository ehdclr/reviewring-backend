import { Module, Global } from '@nestjs/common';
import { Redis } from '@upstash/redis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS', //redisService에 주입할 이름
      useFactory: () => {
        return new Redis({
          url: process.env.REDIS_URL,
          token: process.env.REDIS_TOKEN,
        });
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
