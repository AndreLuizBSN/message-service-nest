import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { createHash } from 'node:crypto';

@Injectable()
export class AbuseProtectionService {
  private readonly redis = new Redis({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
    maxRetriesPerRequest: 1,
  });

  async check(ip: string, email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();

    const emailHash = createHash('sha256')
      .update(normalizedEmail)
      .digest('hex');

    await this.checkLimit(`ip:${ip}:minute`, 50, 60);
    await this.checkLimit(`ip:${ip}:day`, 300, 86400);
    await this.checkLimit(`email:${emailHash}:day`, 100, 86400);
  }

  private async checkLimit(
    key: string,
    max: number,
    seconds: number,
  ): Promise<void> {
    const redisKey = `message-service:limit:${key}`;

    const count = (await this.redis.eval(
      `
      local count = redis.call('INCR', KEYS[1])
      if count == 1 then
        redis.call('EXPIRE', KEYS[1], ARGV[1])
      end
      return count
      `,
      1,
      redisKey,
      seconds,
    )) as number;

    if (count > max) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
