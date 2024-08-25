import { State } from '@generated/state/state'
import { StateListDataReply } from '@generated/state/state_reply'
import CustomException from '@lib/utils/custom.exception'
import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common'
import { Result } from 'neverthrow'
import { GetStateConditionRequestDto } from './dto/get-state-condition'
import { StateInMemoryRepository } from './provider/state.repository'
import { join } from 'path'
import { promises } from 'fs'
import * as CONST from './provider/state.constant'
import { StateEntity } from './entities/state.entity'

@Injectable()
export class StateService implements OnModuleInit {
  constructor(private readonly repo: StateInMemoryRepository) {}

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

    const data: StateEntity[] = jsonData.map((each: any) => {
      const state: StateEntity = {
        stateId: each.state_id,
        stateName: each.state_name,
        countryId: each.country_id,
      }
      return state
    })
    await this.repo.createListStateInMemory(data)
  }

  async getDetail(
    condition: GetStateConditionRequestDto,
  ): Promise<Result<State, Error>> {
    return await this.repo.getDetail(condition)
  }

  async getList(
    condition: GetStateConditionRequestDto,
  ): Promise<Result<StateListDataReply, Error>> {
    return await this.repo.getList(condition)
  }
}
