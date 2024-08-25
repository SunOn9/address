import { District } from '@generated/district/district'
import { DistrictListDataReply } from '@generated/district/district_reply'
import CustomException from '@lib/utils/custom.exception'
import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common'
import { Result } from 'neverthrow'
import { GetDistrictConditionRequestDto } from './dto/get-district-condition'
import { DistrictInMemoryRepository } from './provider/district.repository'
import { join } from 'path'
import { promises } from 'fs'
import * as CONST from './provider/district.constant'
import { DistrictEntity } from './entities/district.entity'

@Injectable()
export class DistrictService implements OnModuleInit {
  constructor(private readonly repo: DistrictInMemoryRepository) {}

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

    const data: DistrictEntity[] = jsonData.map((each: any) => {
      const district: DistrictEntity = {
        districtId: each.district_id,
        districtName: each.district_name,
        grant: each.grant,
        districtSlug: each.district_slug,
        cityId: each.city_id,
      }
      return district
    })
    await this.repo.createListDistrictInMemory(data)
  }

  async getDetail(
    condition: GetDistrictConditionRequestDto,
  ): Promise<Result<District, Error>> {
    return await this.repo.getDetail(condition)
  }

  async getList(
    condition: GetDistrictConditionRequestDto,
  ): Promise<Result<DistrictListDataReply, Error>> {
    return await this.repo.getList(condition)
  }
}
