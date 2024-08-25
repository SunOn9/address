import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { WardService } from './ward.service'
import * as CONST from '@/ward/provider/ward.constant'
import CustomException from '@lib/utils/custom.exception'
import { GetWardConditionRequestDto } from './dto/get-ward-condition'
import { WardListReply, WardReply } from '@generated/ward/ward_reply'

@Controller({ path: 'ward' })
export class WardController {
  constructor(private readonly service: WardService) {}
  ///! HTTP
  @Get('list')
  async getListHTTP(
    @Query() request: GetWardConditionRequestDto,
  ): Promise<WardListReply> {
    const response = {} as WardListReply
    const wardData = await this.service.getList(request)
    if (wardData.isErr()) {
      throw new CustomException(
        'ERROR',
        wardData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = wardData.value
    return response
  }

  @Get('detail')
  async getDetailHTTP(
    @Query() request: GetWardConditionRequestDto,
  ): Promise<WardReply> {
    const response = {} as WardReply
    const wardData = await this.service.getDetail(request)
    if (wardData.isErr()) {
      throw new CustomException(
        'ERROR',
        wardData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = wardData.value
    return response
  }

  ///! GRPC
  @GrpcMethod('WardService', 'GetDetail')
  async getDetail(request: GetWardConditionRequestDto): Promise<WardReply> {
    const response = {} as WardReply
    const wardData = await this.service.getDetail(request)
    if (wardData.isErr()) {
      throw new CustomException(
        'ERROR',
        wardData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = wardData.value
    return response
  }

  @GrpcMethod('WardService', 'GetList')
  async getListWard(
    request: GetWardConditionRequestDto,
  ): Promise<WardListReply> {
    const response = {} as WardListReply
    const wardData = await this.service.getList(request)
    if (wardData.isErr()) {
      throw new CustomException(
        'ERROR',
        wardData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = wardData.value
    return response
  }
}
