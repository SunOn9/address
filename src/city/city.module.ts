import { Module } from '@nestjs/common'
import { CityController } from './city.controller'
import { CityService } from './city.service'
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db'
import { CityInMemoryRepository } from './provider/city.repository'
import { CityReflect } from './provider/city.proto'

@Module({
  imports: [InMemoryDBModule.forFeature('city', {})],
  controllers: [CityController],
  providers: [CityService, CityInMemoryRepository, CityReflect],
  exports: [CityService, CityInMemoryRepository, CityReflect],
})
export class CityModule {}
