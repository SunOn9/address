import { Module } from '@nestjs/common'
import { CountryService } from './country.service'
import { CountryController } from './country.controller'
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db'
import { CountryReflect } from './provider/country.proto'
import { CountryInMemoryRepository } from './provider/country.repository'

@Module({
  imports: [InMemoryDBModule.forFeature('country', {})],
  controllers: [CountryController],
  providers: [CountryService, CountryInMemoryRepository, CountryReflect],
  exports: [CountryService, CountryInMemoryRepository, CountryReflect],
})
export class CountryModule {}
