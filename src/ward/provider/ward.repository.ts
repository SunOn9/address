import { InMemoryDBService } from '@nestjs-addons/in-memory-db'
import { HttpStatus, Injectable } from '@nestjs/common'
import { err, ok, Result } from 'neverthrow'
import CustomException from '@lib/utils/custom.exception'
import { Ward } from '@generated/ward/ward'
import { WardListDataReply } from '@generated/ward/ward_reply'
import { GetWardConditionRequestDto } from '../dto/get-ward-condition'
import { WardEntity } from '../entities/ward.entity'
import * as unidecode from 'unidecode'
import { UtilsService } from '@lib/utils'
import { WardReflect } from './ward.proto'

interface WardEntityInMemory extends WardEntity {
  id: string
}

@Injectable()
export class WardInMemoryRepository extends InMemoryDBService<WardEntityInMemory> {
  constructor(private ultilService: UtilsService, private proto: WardReflect) {
    super({ featureName: 'ward' })
  }

  // async createWardInMemory(createData: Ward): Promise<Result<Ward, Error>> {
  //   try {
  //     const data = this.create(createData)
  //
  //     if (this.ultilService.isObjectEmpty(data)) {
  //       return err(new Error(`Cannot create ward in memory`))
  //     }
  //
  //     return ok(this.proto.reflect(data))
  //   } catch (e) {
  //     throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
  //   }
  // }

  async createListWardInMemory(
    createData: WardEntity[],
  ): Promise<Result<boolean, Error>> {
    try {
      const data = this.createMany(createData)

      if (this.ultilService.isObjectEmpty(data)) {
        return err(new Error(`Cannot create list ward in memory`))
      }

      // const dataRes: Ward[] = []

      // for (const each of data) {
      //   dataRes.push(this.proto.reflect(each))
      // }

      // return ok(dataRes)

      return ok(true)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getWardInMemory(
    condition: GetWardConditionRequestDto,
    isDetail?: boolean,
  ): Promise<Result<WardListDataReply, Error>> {
    try {
      const reply = this.query(record => {
        if (isDetail) {
          if (
            condition.wardName &&
            unidecode(record.wardName.toLocaleLowerCase()) !==
              unidecode(condition.wardName.toLocaleLowerCase())
          )
            return false
        } else {
          if (
            condition.wardName &&
            !unidecode(record.wardName.toLocaleLowerCase()).includes(
              unidecode(condition.wardName.toLocaleLowerCase()),
            )
          )
            return false
        }

        if (condition.wardSlug && !record.wardSlug.includes(condition.wardSlug))
          return false
        if (condition.wardId && record.wardId !== condition.wardId) return false
        if (condition.districtId && record.districtId !== condition.districtId)
          return false
        if (condition.cityId && record.cityId !== condition.cityId) return false
        if (condition.listWardId !== undefined) {
          if (
            condition.listWardId.length !== 0 &&
            !condition.listWardId.includes(record.wardId)
          )
            return false
        }

        return true
      })

      if (!reply) {
        return err(new Error(`Cannot get in memory`))
      }

      const data = WardListDataReply.create()

      reply.forEach(each => {
        data.wardList.push(this.proto.reflect(each))
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
    condition: GetWardConditionRequestDto,
  ): Promise<Result<Ward, Error>> {
    if (!condition) {
      return err(new Error(`Empty condition`))
    }

    condition.listWardId = undefined

    const reply = await this.getWardInMemory(
      condition,
      true, //isDetail
    )

    if (reply.isErr()) return err(reply.error)

    if (reply.value.total !== 1) {
      return err(
        new Error(`Cannot not get in memory with conditions: [${condition}]`),
      )
    }

    return ok(reply.value.wardList[0])
  }

  async getList(
    condition: GetWardConditionRequestDto,
  ): Promise<Result<WardListDataReply, Error>> {
    const page = condition.page
    const limit = condition.limit

    const reply = await this.getWardInMemory(condition)
    if (reply.isErr()) return err(reply.error)

    if (page && limit) {
      return ok({
        wardList: reply.value.wardList.slice(
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
