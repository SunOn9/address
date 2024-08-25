import { Module } from '@nestjs/common'
import { DistrictController } from './district.controller'
import { DistrictService } from './district.service'
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db'
import { DistrictInMemoryRepository } from './provider/district.repository'
import { DistrictReflect } from './provider/district.proto'

@Module({
  imports: [InMemoryDBModule.forFeature('district', {})],
  controllers: [DistrictController],
  providers: [DistrictService, DistrictInMemoryRepository, DistrictReflect],
  exports: [DistrictService, DistrictInMemoryRepository, DistrictReflect],
})
export class DistrictModule {}
