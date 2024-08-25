import { InMemoryDBService } from '@nestjs-addons/in-memory-db'
import { HttpStatus, Injectable } from '@nestjs/common'
import { err, ok, Result } from 'neverthrow'
import CustomException from '@lib/utils/custom.exception'
import { Country } from '@generated/country/country'
import { CountryListDataReply } from '@generated/country/country_reply'
import { GetCountryConditionRequestDto } from '../dto/get-country-condition'
import { CountryEntity } from '../entities/country.entity'
import * as unidecode from 'unidecode'
import { UtilsService } from '@lib/utils'
import { CountryReflect } from './country.proto'

interface CountryEntityInMemory extends CountryEntity {
  id: string
}

@Injectable()
export class CountryInMemoryRepository extends InMemoryDBService<CountryEntityInMemory> {
  constructor(
    private ultilService: UtilsService,
    private proto: CountryReflect,
  ) {
    super({ featureName: 'country' })
  }

  // async createCountryInMemory(
  //   createData: Country,
  // ): Promise<Result<Country, Error>> {
  //   try {
  //     const data = this.create(createData)
  //
  //     if (this.ultilService.isObjectEmpty(data)) {
  //       return err(new Error(`Cannot create country in memory`))
  //     }
  //
  //     return ok(this.proto.reflect(data))
  //   } catch (e) {
  //     throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
  //   }
  // }

  async createListCountryInMemory(
    createData: CountryEntity[],
  ): Promise<Result<boolean, Error>> {
    try {
      const data = this.createMany(createData)

      if (this.ultilService.isObjectEmpty(data)) {
        return err(new Error(`Cannot create list country in memory`))
      }

      // const dataRes: Country[] = []
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

  async getCountryInMemory(
    condition: GetCountryConditionRequestDto,
    isDetail?: boolean,
  ): Promise<Result<CountryListDataReply, Error>> {
    try {
      const reply = this.query(record => {
        if (isDetail) {
          if (
            condition.countryName &&
            unidecode(record.countryName.toLocaleLowerCase()) !==
              unidecode(condition.countryName.toLocaleLowerCase())
          )
            return false
        } else {
          if (
            condition.countryName &&
            !unidecode(record.countryName.toLocaleLowerCase()).includes(
              unidecode(condition.countryName.toLocaleLowerCase()),
            )
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

        return true
      })

      if (!reply) {
        return err(new Error(`Cannot get in memory`))
      }

      const data = CountryListDataReply.create()

      reply.forEach(each => {
        data.countryList.push(this.proto.reflect(each))
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
    condition: GetCountryConditionRequestDto,
  ): Promise<Result<Country, Error>> {
    if (!condition) {
      return err(new Error(`Empty condition`))
    }

    condition.listCountryId = undefined

    const reply = await this.getCountryInMemory(
      condition,
      true, // isDetail
    )

    if (reply.isErr()) return err(reply.error)

    if (reply.value.total !== 1) {
      return err(
        new Error(`Cannot not get in memory with conditions: [${condition}]`),
      )
    }

    return ok(reply.value.countryList[0])
  }

  async getList(
    condition: GetCountryConditionRequestDto,
  ): Promise<Result<CountryListDataReply, Error>> {
    const page = condition.page
    const limit = condition.limit

    const reply = await this.getCountryInMemory(condition)
    if (reply.isErr()) return err(reply.error)

    if (page && limit) {
      return ok({
        countryList: reply.value.countryList.slice(
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
