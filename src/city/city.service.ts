import { City } from '@generated/city/city'
import { CityListDataReply } from '@generated/city/city_reply'
import CustomException from '@lib/utils/custom.exception'
import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common'
import { Result } from 'neverthrow'
import { GetCityConditionRequestDto } from './dto/get-city-condition'
import { CityInMemoryRepository } from './provider/city.repository'
import { join } from 'path'
import { promises } from 'fs'
import * as CONST from './provider/city.constant'
import { CityEntity } from './entities/city.entity'

@Injectable()
export class CityService implements OnModuleInit {
  constructor(private readonly repo: CityInMemoryRepository) {}

  async onModuleInit() {
    const filePath = join(__dirname, '../../../data/', CONST.DATA_NAME)
    const fileContent = await promises.readFile(filePath, 'utf8')
    const jsonData = JSON.parse(fileContent)

    if (!jsonData) {
      throw new CustomException(
        'ERROR',
        `Cannot read in file`,
        HttpStatus.BAD_REQUEST,
      )
    }

    const data: CityEntity[] = jsonData.map((each: any) => {
      const city: CityEntity = {
        cityId: each.city_id,
        cityName: each.city_name,
        grant: each.grant,
        citySlug: each.city_slug,
        countryId: each.country_id,
        stateId: each.state_id ?? null,
      }
      return city
    })
    await this.repo.createListCityInMemory(data)
  }

  async getDetail(
    condition: GetCityConditionRequestDto,
  ): Promise<Result<City, Error>> {
    return await this.repo.getDetail(condition)
  }

  async getList(
    condition: GetCityConditionRequestDto,
  ): Promise<Result<CityListDataReply, Error>> {
    return await this.repo.getList(condition)
  }
}
