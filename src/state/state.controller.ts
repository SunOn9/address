import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { StateService } from './state.service'
import * as CONST from '@/state/provider/state.constant'
import { StateListReply, StateReply } from '@generated/state/state_reply'
import CustomException from '@lib/utils/custom.exception'
import { GetStateConditionRequestDto } from './dto/get-state-condition'

@Controller({ path: 'state' })
export class StateController {
  constructor(private readonly service: StateService) {}
  ///! HTTP
  @Get('list')
  async getListHTTP(
    @Query() request: GetStateConditionRequestDto,
  ): Promise<StateListReply> {
    const response = {} as StateListReply
    const stateData = await this.service.getList(request)
    if (stateData.isErr()) {
      throw new CustomException(
        'ERROR',
        stateData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = stateData.value
    return response
  }

  @Get('detail')
  async getDetailHTTP(
    @Query() request: GetStateConditionRequestDto,
  ): Promise<StateReply> {
    const response = {} as StateReply
    const stateData = await this.service.getDetail(request)
    if (stateData.isErr()) {
      throw new CustomException(
        'ERROR',
        stateData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = stateData.value
    return response
  }

  ///! GRPC
  @GrpcMethod('StateService', 'GetDetail')
  async getDetail(request: GetStateConditionRequestDto): Promise<StateReply> {
    const response = {} as StateReply
    const stateData = await this.service.getDetail(request)
    if (stateData.isErr()) {
      throw new CustomException(
        'ERROR',
        stateData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = stateData.value
    return response
  }

  @GrpcMethod('StateService', 'GetList')
  async getListState(
    request: GetStateConditionRequestDto,
  ): Promise<StateListReply> {
    const response = {} as StateListReply
    const stateData = await this.service.getList(request)
    if (stateData.isErr()) {
      throw new CustomException(
        'ERROR',
        stateData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = stateData.value
    return response
  }
}
