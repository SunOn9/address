import { InjectRedis } from '@liaoliaots/nestjs-redis/dist/redis/common/redis.decorator'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import Redis from 'ioredis/built/Redis'
import { err, ok, Result, ResultAsync } from 'neverthrow'

@Injectable()
export class RedisxService {
  constructor(
    @InjectRedis() private readonly redis: Redis, // or // @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis
  ) {}

  async get<T>(key: string): Promise<Result<T, Error>> {
    const resp = this.redis.get(key)
    const result: Result<string, Error> = await ResultAsync.fromPromise(
      resp,
      () => new Error('Redis error'),
    )

    if (result.isErr()) {
      return err(result.error)
    }

    if (!result.value) {
      return err(new Error(`key: ${key} is not exist in Redis`))
    }

    const valueT: T = JSON.parse(result.value)

    return ok(valueT)
  }

  async expire(
    key: string,
    second: string | number,
  ): Promise<Result<number, Error>> {
    const resp = this.redis.expire(key, second)

    const result = await ResultAsync.fromPromise(
      resp,
      () => new Error('Redis error'),
    )

    return result
  }

  async incr(key: string): Promise<Result<number, Error>> {
    const resp = this.redis.incr(key)

    const result = await ResultAsync.fromPromise(
      resp,
      () => new Error('Redis error'),
    )

    return result
  }

  async decr(key: string): Promise<Result<number, Error>> {
    const resp = this.redis.decr(key)

    const result = await ResultAsync.fromPromise(
      resp,
      () => new Error('Redis error'),
    )

    return result
  }

  async setWithExpire<T>(
    key: string,
    value: T,
    expire: number,
  ): Promise<Result<string, Error>> {
    const resp = this.redis.set(key, JSON.stringify(value), 'EXAT', expire)
    const result = await ResultAsync.fromPromise(
      resp,
      () => new Error('Redis error'),
    )

    return result
  }

  async set<T>(key: string, value: T): Promise<Result<string, Error>> {
    const resp = this.redis.set(key, JSON.stringify(value))
    const result = await ResultAsync.fromPromise(
      resp,
      () => new Error('Redis error'),
    )

    return result
  }

  async del(key: string): Promise<Result<number, Error>> {
    const resp = this.redis.del(key)
    const result = await ResultAsync.fromPromise(
      resp,
      () => new Error('Redis error'),
    )

    return result
  }

  async setnx<T>(key: string, value: T): Promise<Result<number, Error>> {
    const resp = this.redis.setnx(key, JSON.stringify(value))

    const result = await ResultAsync.fromPromise(
      resp,
      () => new Error('Redis error'),
    )

    return result
  }

  async exists(key: string): Promise<Result<number, Error>> {
    const resp = this.redis.exists(key)

    const result = await ResultAsync.fromPromise(
      resp,
      () => new Error('Redis error'),
    )

    return result
  }

  async rpush<T>(key: string, value: T): Promise<Result<number, Error>> {
    const resp = this.redis.rpush(key, JSON.stringify(value))

    const result = await ResultAsync.fromPromise(
      resp,
      () => new Error('Redis error'),
    )

    return result
  }

  async lrem<T>(
    key: string,
    count: number,
    value: T,
  ): Promise<Result<number, Error>> {
    const resp = this.redis.lrem(key, count, JSON.stringify(value))

    const result = await ResultAsync.fromPromise(
      resp,
      () => new Error('Redis error'),
    )

    return result
  }

  async lrange<T>(
    key: string,
    start: number,
    stop: number,
  ): Promise<Result<T[], Error>> {
    const resp = this.redis.lrange(key, start, stop)

    const result = await ResultAsync.fromPromise(
      resp,
      () => new Error('Redis error'),
    )

    if (result.isErr()) {
      return err(result.error)
    }

    if (!result.value) {
      return err(new Error(`key: ${key} is not exist in Redis`))
    }

    const valueT: T[] = []

    for (const each of result.value) {
      const value: T = JSON.parse(each)
      valueT.push(value)
    }

    return ok(valueT)
  }
}
