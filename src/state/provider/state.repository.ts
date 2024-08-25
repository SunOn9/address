import { InMemoryDBService } from '@nestjs-addons/in-memory-db'
import { HttpStatus, Injectable } from '@nestjs/common'
import { err, ok, Result } from 'neverthrow'
import CustomException from '@lib/utils/custom.exception'
import { State } from '@generated/state/state'
import { StateListDataReply } from '@generated/state/state_reply'
import { GetStateConditionRequestDto } from '../dto/get-state-condition'
import { StateEntity } from '../entities/state.entity'
import * as unidecode from 'unidecode'
import { UtilsService } from '@lib/utils'
import { StateReflect } from './state.proto'

interface StateEntityInMemory extends StateEntity {
  id: string
}

@Injectable()
export class StateInMemoryRepository extends InMemoryDBService<StateEntityInMemory> {
  constructor(private ultilService: UtilsService, private proto: StateReflect) {
    super({ featureName: 'state' })
  }

  // async createStateInMemory(createData: State): Promise<Result<State, Error>> {
  //   try {
  //     const data = this.create(createData)
  //
  //     if (this.ultilService.isObjectEmpty(data)) {
  //       return err(new Error(`Cannot create state in memory`))
  //     }
  //
  //     return ok(this.proto.reflect(data))
  //   } catch (e) {
  //     throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
  //   }
  // }

  async createListStateInMemory(
    createData: StateEntity[],
  ): Promise<Result<boolean, Error>> {
    try {
      const data = this.createMany(createData)

      if (this.ultilService.isObjectEmpty(data)) {
        return err(new Error(`Cannot create list state in memory`))
      }

      // const dataRes: State[] = []
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

  async getStateInMemory(
    condition: GetStateConditionRequestDto,
    isDetail?: boolean,
  ): Promise<Result<StateListDataReply, Error>> {
    try {
      const reply = this.query(record => {
        if (isDetail) {
          if (
            condition.stateName &&
            unidecode(record.stateName.toLocaleLowerCase()) !==
              unidecode(condition.stateName.toLocaleLowerCase())
          )
            return false
        } else {
          if (
            condition.stateName &&
            !unidecode(record.stateName.toLocaleLowerCase()).includes(
              unidecode(condition.stateName.toLocaleLowerCase()),
            )
          )
            return false
        }

        if (condition.stateId && record.stateId !== condition.stateId)
          return false
        if (condition.countryId && record.countryId !== condition.countryId)
          return false

        if (condition.listCountryId !== undefined) {
          if (
            condition.listCountryId.length !== 0 &&
            !condition.listCountryId.includes(record.countryId)
          )
            return false
        }

        if (condition.listStateId !== undefined) {
          if (
            condition.listStateId.length !== 0 &&
            !condition.listStateId.includes(record.stateId)
          )
            return false
        }

        return true
      })

      if (!reply) {
        return err(new Error(`Cannot get in memory`))
      }

      const data = StateListDataReply.create()

      reply.forEach(each => {
        data.stateList.push(this.proto.reflect(each))
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
    condition: GetStateConditionRequestDto,
  ): Promise<Result<State, Error>> {
    if (!condition) {
      return err(new Error(`Empty condition`))
    }

    const reply = await this.getStateInMemory(
      condition,
      true, // isDetail
    )

    if (reply.isErr()) return err(reply.error)

    if (reply.value.total !== 1) {
      return err(
        new Error(`Cannot not get in memory with conditions: [${condition}]`),
      )
    }

    return ok(reply.value.stateList[0])
  }

  async getList(
    condition: GetStateConditionRequestDto,
  ): Promise<Result<StateListDataReply, Error>> {
    const page = condition.page
    const limit = condition.limit

    condition.listStateId = undefined

    const reply = await this.getStateInMemory(condition)
    if (reply.isErr()) return err(reply.error)

    if (page && limit) {
      return ok({
        stateList: reply.value.stateList.slice(
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
