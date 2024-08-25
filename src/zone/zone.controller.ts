import { Controller, Get, HttpStatus, Post, Query } from '@nestjs/common'
import CustomException from '@lib/utils/custom.exception'
import { GrpcMethod } from '@nestjs/microservices'
import { ZoneService } from './zone.service'
import * as CONST from './provider/zone.constant'
import { SimpleReply } from '@generated/common'
import { GetZoneByZipcodeRequestDto } from './dto/get-zone-by-zipcode.dto'

@Controller({ path: 'zone' })
export class ZoneController {
  constructor(private readonly service: ZoneService) {}

  ///! HTTP
  @Post('init-zone-usps')
  async initZoneUspsHTTP(): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.initZoneUSPS()

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = CONST.DEFAULT_SUCCESS_MESSAGE
    return response
  }

  @Get('get-zone')
  async getZoneHTTP(
    @Query() request: GetZoneByZipcodeRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.getZoneByZipcode(request)

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }

  ///! GRPC
  @GrpcMethod('ZoneService', 'InitZoneUsps')
  async initZoneUsps(): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.initZoneUSPS()

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = CONST.DEFAULT_SUCCESS_MESSAGE
    return response
  }

  @GrpcMethod('ZoneService', 'GetZoneByZipcode')
  async getZone(request: GetZoneByZipcodeRequestDto): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.getZoneByZipcode(request)

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }
}
