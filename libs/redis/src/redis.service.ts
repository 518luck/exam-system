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

  // 获取有序集合的排名列表（按分数从高到低）
  async zRankingList(key: string, start: number = 0, end: number = -1) {
    return this.redisClient.zRange(key, start, end, {
      REV: true,
    });
  }

  // 添加有序集合的成员（每个成员都有一个分数）
  async zAdd(key: string, members: Record<string, number>) {
    const mems: { value: string; score: number }[] = [];
    for (const key in members) {
      mems.push({
        value: key,
        score: members[key],
      });
    }
    return await this.redisClient.zAdd(key, mems);
  }
}
