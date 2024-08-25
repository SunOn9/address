import { Global, Module } from '@nestjs/common'
import { MyConfigService } from './config.service'
import { ConfigModule } from '@nestjs/config'

@Global()
@Module({
  exports: [MyConfigService],
  imports: [ConfigModule],
  providers: [MyConfigService],
})
export class MyConfigModule {}
