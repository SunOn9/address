import { Injectable } from '@nestjs/common'
import Redis from 'ioredis/built/Redis'
import { InjectRedis } from '@liaoliaots/nestjs-redis/dist/redis/common/redis.decorator'

@Injectable()
export class RedisPubSubService {
  private publisher: Redis
  private subscriber: Redis

  constructor(@InjectRedis() private readonly redis: Redis) {
    this.publisher = redis.duplicate()
    this.subscriber = redis.duplicate()
  }

  subscribe(
    channel: string,
    callback: (channel: string, message: string) => void,
  ) {
    this.subscriber.on('message', callback)
    this.subscriber.subscribe(channel)
  }

  publish(channel: string, message: string) {
    this.publisher.publish(channel, message)
  }
}
