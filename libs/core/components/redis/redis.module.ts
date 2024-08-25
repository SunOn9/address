import { Global, Module } from '@nestjs/common'
import { RedisxService } from './redis.service'
import { RedisPubSubService } from './redis-pubsub.service'

@Global()
@Module({
  imports: [],
  providers: [RedisxService, RedisPubSubService],
  exports: [RedisxService, RedisPubSubService],
})
export class RedisxModule {}
