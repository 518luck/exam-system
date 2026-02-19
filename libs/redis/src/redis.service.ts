import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  // 根据模式模糊搜索 Redis 中的键名（生产环境慎用 KEYS 命令）
  async keys(pattern: string) {
    return await this.redisClient.keys(pattern);
  }

  // 根据键名获取存储的字符串值
  async get(key: string) {
    return await this.redisClient.get(key);
  }

  // 设置键值对，并支持可选的过期时间（单位：秒）
  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
}
