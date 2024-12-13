import { Injectable, Inject } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async set(key: string, value: string, ttl?: number) {
    await this.redis.set(key, value, { ex: ttl });
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async del(key: string) {
    await this.redis.del(key);
  }
}
