import { Module } from '@nestjs/common'
import { WardService } from './ward.service'
import { WardController } from './ward.controller'
import { WardInMemoryRepository } from './provider/ward.repository'
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db'
import { WardReflect } from './provider/ward.proto'

@Module({
  imports: [InMemoryDBModule.forFeature('ward', {})],
  controllers: [WardController],
  providers: [WardService, WardInMemoryRepository, WardReflect],
  exports: [WardService, WardInMemoryRepository, WardReflect],
})
export class WardModule {}
