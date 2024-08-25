import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { CountryService } from './country.service'
import * as CONST from '@/country/provider/country.constant'
import {
  CountryListReply,
  CountryReply,
} from '@generated/country/country_reply'
import CustomException from '@lib/utils/custom.exception'
import { GetCountryConditionRequestDto } from './dto/get-country-condition'

@Controller({ path: 'country' })
export class CountryController {
  constructor(private readonly service: CountryService) {}
  ///! HTTP
  @Get('list')
  async getListHTTP(
    @Query() request: GetCountryConditionRequestDto,
  ): Promise<CountryListReply> {
    const response = {} as CountryListReply
    const countryData = await this.service.getList(request)
    if (countryData.isErr()) {
      throw new CustomException(
        'ERROR',
        countryData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = countryData.value
    return response
  }

  @Get('detail')
  async getDetailHTTP(
    @Query() request: GetCountryConditionRequestDto,
  ): Promise<CountryReply> {
    const response = {} as CountryReply
    const countryData = await this.service.getDetail(request)
    if (countryData.isErr()) {
      throw new CustomException(
        'ERROR',
        countryData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = countryData.value
    return response
  }

  ///! GRPC
  @GrpcMethod('CountryService', 'GetDetail')
  async getDetail(
    request: GetCountryConditionRequestDto,
  ): Promise<CountryReply> {
    const response = {} as CountryReply
    const countryData = await this.service.getDetail(request)
    if (countryData.isErr()) {
      throw new CustomException(
        'ERROR',
        countryData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = countryData.value
    return response
  }

  @GrpcMethod('CountryService', 'GetList')
  async getList(
    request: GetCountryConditionRequestDto,
  ): Promise<CountryListReply> {
    const response = {} as CountryListReply
    const countryData = await this.service.getList(request)
    if (countryData.isErr()) {
      throw new CustomException(
        'ERROR',
        countryData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = countryData.value
    return response
  }
}
