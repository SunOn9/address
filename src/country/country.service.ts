import { Country } from '@generated/country/country'
import { CountryListDataReply } from '@generated/country/country_reply'
import CustomException from '@lib/utils/custom.exception'
import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common'
import { Result } from 'neverthrow'
import { GetCountryConditionRequestDto } from './dto/get-country-condition'
import { CountryInMemoryRepository } from './provider/country.repository'
import { join } from 'path'
import { promises } from 'fs'
import * as CONST from './provider/country.constant'
import { CountryEntity } from './entities/country.entity'

@Injectable()
export class CountryService implements OnModuleInit {
  constructor(private readonly repo: CountryInMemoryRepository) {}

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

    const data: CountryEntity[] = jsonData.map((each: any) => {
      const country: CountryEntity = {
        countryId: each.country_id,
        countryName: each.country_name,
      }
      return country
    })
    await this.repo.createListCountryInMemory(data)
  }

  async getDetail(
    condition: GetCountryConditionRequestDto,
  ): Promise<Result<Country, Error>> {
    return await this.repo.getDetail(condition)
  }

  async getList(
    condition: GetCountryConditionRequestDto,
  ): Promise<Result<CountryListDataReply, Error>> {
    return await this.repo.getList(condition)
  }
}
