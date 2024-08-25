import { Module } from '@nestjs/common'
import { StateController } from './state.controller'
import { StateService } from './state.service'
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db'
import { StateInMemoryRepository } from './provider/state.repository'
import { StateReflect } from './provider/state.proto'

@Module({
  imports: [InMemoryDBModule.forFeature('state', {})],
  controllers: [StateController],
  providers: [StateService, StateInMemoryRepository, StateReflect],
  exports: [StateService, StateInMemoryRepository, StateReflect],
})
export class StateModule {}
