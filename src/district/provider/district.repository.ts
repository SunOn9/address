import { InMemoryDBService } from '@nestjs-addons/in-memory-db'
import { HttpStatus, Injectable } from '@nestjs/common'
import { err, ok, Result } from 'neverthrow'
import CustomException from '@lib/utils/custom.exception'
import { District } from '@generated/district/district'
import { DistrictListDataReply } from '@generated/district/district_reply'
import { GetDistrictConditionRequestDto } from '../dto/get-district-condition'
import { DistrictEntity } from '../entities/district.entity'
import * as unidecode from 'unidecode'
import { UtilsService } from '@lib/utils'
import { DistrictReflect } from './district.proto'

interface DistrictEntityInMemory extends DistrictEntity {
  id: string
}

@Injectable()
export class DistrictInMemoryRepository extends InMemoryDBService<DistrictEntityInMemory> {
  constructor(
    private ultilService: UtilsService,
    private proto: DistrictReflect,
  ) {
    super({ featureName: 'district' })
  }

  // async createDistrictInMemory(
  //   createData: District,
  // ): Promise<Result<District, Error>> {
  //   try {
  //     const data = this.create(createData)
  //
  //     if (this.ultilService.isObjectEmpty(data)) {
  //       return err(new Error(`Cannot create district in memory`))
  //     }
  //
  //     return ok(this.proto.reflect(data))
  //   } catch (e) {
  //     throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
  //   }
  // }

  async createListDistrictInMemory(
    createData: DistrictEntity[],
  ): Promise<Result<boolean, Error>> {
    try {
      const data = this.createMany(createData)

      if (this.ultilService.isObjectEmpty(data)) {
        return err(new Error(`Cannot create list district in memory`))
      }

      // const dataRes: District[] = []
      //
      // for (const each of data) {
      //   dataRes.push(this.proto.reflect(each))
      // }
      //
      // return ok(dataRes)
      return ok(true)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getDistrictInMemory(
    condition: GetDistrictConditionRequestDto,
    isDetail?: boolean,
  ): Promise<Result<DistrictListDataReply, Error>> {
    try {
      const reply = this.query(record => {
        if (isDetail) {
          if (
            condition.districtName &&
            unidecode(record.districtName.toLocaleLowerCase()) !==
              unidecode(condition.districtName.toLocaleLowerCase())
          )
            return false
        } else {
          if (
            condition.districtName &&
            !unidecode(record.districtName.toLocaleLowerCase()).includes(
              unidecode(condition.districtName.toLocaleLowerCase()),
            )
          )
            return false
        }

        if (
          condition.districtSlug &&
          !record.districtSlug.includes(condition.districtSlug)
        )
          return false
        if (condition.districtId && record.districtId !== condition.districtId)
          return false
        if (condition.cityId && record.cityId !== condition.cityId) return false
        if (condition.listDistrictId !== undefined) {
          if (
            condition.listDistrictId.length !== 0 &&
            !condition.listDistrictId.includes(record.districtId)
          )
            return false
        }

        return true
      })

      if (!reply) {
        return err(new Error(`Cannot get in memory`))
      }

      const data = DistrictListDataReply.create()

      reply.forEach(each => {
        data.districtList.push(this.proto.reflect(each))
        data.total++
      })

      // if (data.total == 0) {
      //   return err(new Error(`Empty query`))
      // }

      return ok(data)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getDetail(
    condition: GetDistrictConditionRequestDto,
  ): Promise<Result<District, Error>> {
    if (!condition) {
      return err(new Error(`Empty condition`))
    }

    const reply = await this.getDistrictInMemory(
      condition,
      true, //isDetail
    )

    if (reply.isErr()) return err(reply.error)

    if (reply.value.total !== 1) {
      return err(
        new Error(`Cannot not get in memory with conditions: [${condition}]`),
      )
    }

    return ok(reply.value.districtList[0])
  }

  async getList(
    condition: GetDistrictConditionRequestDto,
  ): Promise<Result<DistrictListDataReply, Error>> {
    const page = condition.page
    const limit = condition.limit

    condition.listDistrictId = undefined

    const reply = await this.getDistrictInMemory(condition)

    if (reply.isErr()) return err(reply.error)

    if (page && limit) {
      return ok({
        districtList: reply.value.districtList.slice(
          (page - 1) * limit,
          (page - 1) * limit + limit,
        ),
        total: reply.value.total,
        page,
        limit,
      })
    } else {
      return reply
    }
  }
}
