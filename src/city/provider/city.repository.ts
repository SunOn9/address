import { InMemoryDBService } from '@nestjs-addons/in-memory-db'
import { HttpStatus, Injectable } from '@nestjs/common'
import { err, ok, Result } from 'neverthrow'
import CustomException from '@lib/utils/custom.exception'
import { City } from '@generated/city/city'
import { CityListDataReply } from '@generated/city/city_reply'
import { GetCityConditionRequestDto } from '../dto/get-city-condition'
import { CityEntity } from '../entities/city.entity'
import * as unidecode from 'unidecode'
import { UtilsService } from '@lib/utils'
import { CityReflect } from './city.proto'

interface CityEntityInMemory extends CityEntity {
  id: string
}

@Injectable()
export class CityInMemoryRepository extends InMemoryDBService<CityEntityInMemory> {
  constructor(private ultilService: UtilsService, private proto: CityReflect) {
    super({ featureName: 'city' })
  }

  async createCityInMemory(createData: City): Promise<Result<City, Error>> {
    try {
      const data = this.create(createData)

      if (this.ultilService.isObjectEmpty(data)) {
        return err(new Error(`Cannot create city in memory`))
      }

      return ok(this.proto.reflect(data))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async createListCityInMemory(
    createData: CityEntity[],
  ): Promise<Result<boolean, Error>> {
    try {
      const data = this.createMany(createData)

      if (this.ultilService.isObjectEmpty(data)) {
        return err(new Error(`Cannot create list city in memory`))
      }

      // const dataRes: City[] = []
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

  async getCityInMemory(
    condition: GetCityConditionRequestDto,
    isDetail?: boolean,
  ): Promise<Result<CityListDataReply, Error>> {
    try {
      const reply = this.query(record => {
        if (isDetail) {
          if (
            condition.cityName &&
            unidecode(record.cityName.toLocaleLowerCase()) !==
              unidecode(condition.cityName.toLocaleLowerCase())
          )
            return false
        } else {
          if (
            condition.cityName &&
            !unidecode(record.cityName.toLocaleLowerCase()).includes(
              unidecode(condition.cityName.toLocaleLowerCase()),
            )
          )
            return false
        }

        if (condition.citySlug && !record.citySlug.includes(condition.citySlug))
          return false

        if (condition.cityId && record.cityId !== condition.cityId) return false

        if (condition.listCityId !== undefined) {
          if (
            condition.listCityId.length !== 0 &&
            !condition.listCityId.includes(record.cityId)
          )
            return false
        }

        if (condition.countryId && record.countryId !== condition.countryId)
          return false

        if (condition.listCountryId !== undefined) {
          if (
            condition.listCountryId.length !== 0 &&
            !condition.listCountryId.includes(record.countryId)
          )
            return false
        }

        if (condition.stateId && record.stateId !== condition.stateId)
          return false

        if (condition.listStateId !== undefined) {
          if (
            condition.listStateId.length !== 0 &&
            !condition.listStateId.includes(record.stateId)
          )
            return false
        }

        return true
      })

      if (!reply) return err(new Error(`Cannot get in memory`))

      const data = CityListDataReply.create()

      reply.forEach(each => {
        data.cityList.push(this.proto.reflect(each))
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
    condition: GetCityConditionRequestDto,
  ): Promise<Result<City, Error>> {
    if (!condition) {
      return err(new Error(`Empty condition`))
    }

    condition.listCityId = undefined

    const reply = await this.getCityInMemory(
      condition,
      true, //isDetail
    )

    if (reply.isErr()) return err(reply.error)

    if (reply.value.total !== 1) {
      return err(
        new Error(`Cannot not get in memory with conditions: [${condition}]`),
      )
    }

    return ok(reply.value.cityList[0])
  }

  async getList(
    condition: GetCityConditionRequestDto,
  ): Promise<Result<CityListDataReply, Error>> {
    const page = condition.page
    const limit = condition.limit

    const reply = await this.getCityInMemory(condition)

    if (reply.isErr()) return err(reply.error)

    if (page && limit) {
      return ok({
        cityList: reply.value.cityList.slice(
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
