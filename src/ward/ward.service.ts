import { Ward } from '@generated/ward/ward'
import { WardListDataReply } from '@generated/ward/ward_reply'
import CustomException from '@lib/utils/custom.exception'
import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common'
import { Result } from 'neverthrow'
import { GetWardConditionRequestDto } from './dto/get-ward-condition'
import { WardInMemoryRepository } from './provider/ward.repository'
import { join } from 'path'
import { promises } from 'fs'
import * as CONST from './provider/ward.constant'
import { WardEntity } from './entities/ward.entity'

@Injectable()
export class WardService implements OnModuleInit {
  constructor(private readonly repo: WardInMemoryRepository) {}

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

    const data: WardEntity[] = jsonData.map((each: any) => {
      const ward: WardEntity = {
        wardId: each.ward_id,
        wardName: each.ward_name,
        grant: each.grant,
        wardSlug: each.ward_slug,
        districtId: each.district_id,
        cityId: each.city_id,
      }
      return ward
    })
    await this.repo.createListWardInMemory(data)
  }

  async getDetail(
    condition: GetWardConditionRequestDto,
  ): Promise<Result<Ward, Error>> {
    return await this.repo.getDetail(condition)
  }

  async getList(
    condition: GetWardConditionRequestDto,
  ): Promise<Result<WardListDataReply, Error>> {
    return await this.repo.getList(condition)
  }
}
