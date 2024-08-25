import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { CityService } from './city.service'
import * as CONST from '@/city/provider/city.constant'
import { CityListReply, CityReply } from '@generated/city/city_reply'
import CustomException from '@lib/utils/custom.exception'
import { GetCityConditionRequestDto } from './dto/get-city-condition'

@Controller({ path: 'city' })
export class CityController {
  constructor(private readonly service: CityService) {}
  ///! HTTP
  @Get('list')
  async getListHTTP(
    @Query() request: GetCityConditionRequestDto,
  ): Promise<CityListReply> {
    const response = {} as CityListReply
    const cityData = await this.service.getList(request)
    if (cityData.isErr()) {
      throw new CustomException(
        'ERROR',
        cityData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = cityData.value
    return response
  }

  @Get('detail')
  async getDetailHTTP(
    @Query() request: GetCityConditionRequestDto,
  ): Promise<CityReply> {
    const response = {} as CityReply
    const cityData = await this.service.getDetail(request)
    if (cityData.isErr()) {
      throw new CustomException(
        'ERROR',
        cityData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = cityData.value
    return response
  }

  ///! GRPC
  @GrpcMethod('CityService', 'GetDetail')
  async getDetail(request: GetCityConditionRequestDto): Promise<CityReply> {
    const response = {} as CityReply
    const cityData = await this.service.getDetail(request)
    if (cityData.isErr()) {
      throw new CustomException(
        'ERROR',
        cityData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = cityData.value
    return response
  }

  @GrpcMethod('CityService', 'GetList')
  async getListCity(
    request: GetCityConditionRequestDto,
  ): Promise<CityListReply> {
    const response = {} as CityListReply
    const cityData = await this.service.getList(request)
    if (cityData.isErr()) {
      throw new CustomException(
        'ERROR',
        cityData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = cityData.value
    return response
  }
}
