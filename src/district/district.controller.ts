import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { DistrictService } from './district.service'
import * as CONST from '@/district/provider/district.constant'
import {
  DistrictListReply,
  DistrictReply,
} from '@generated/district/district_reply'
import CustomException from '@lib/utils/custom.exception'
import { GetDistrictConditionRequestDto } from './dto/get-district-condition'

@Controller({ path: 'district' })
export class DistrictController {
  constructor(private readonly service: DistrictService) {}
  ///! HTTP
  @Get('list')
  async getListHTTP(
    @Query() request: GetDistrictConditionRequestDto,
  ): Promise<DistrictListReply> {
    const response = {} as DistrictListReply
    const districtData = await this.service.getList(request)
    if (districtData.isErr()) {
      throw new CustomException(
        'ERROR',
        districtData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = districtData.value
    return response
  }

  @Get('detail')
  async getDetailHTTP(
    @Query() request: GetDistrictConditionRequestDto,
  ): Promise<DistrictReply> {
    const response = {} as DistrictReply
    const districtData = await this.service.getDetail(request)
    if (districtData.isErr()) {
      throw new CustomException(
        'ERROR',
        districtData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = districtData.value
    return response
  }

  ///! GRPC
  @GrpcMethod('DistrictService', 'GetDetail')
  async getDetail(
    request: GetDistrictConditionRequestDto,
  ): Promise<DistrictReply> {
    const response = {} as DistrictReply
    const districtData = await this.service.getDetail(request)
    if (districtData.isErr()) {
      throw new CustomException(
        'ERROR',
        districtData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = districtData.value
    return response
  }

  @GrpcMethod('DistrictService', 'GetList')
  async getListDistrict(
    request: GetDistrictConditionRequestDto,
  ): Promise<DistrictListReply> {
    const response = {} as DistrictListReply
    const districtData = await this.service.getList(request)
    if (districtData.isErr()) {
      throw new CustomException(
        'ERROR',
        districtData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = districtData.value
    return response
  }
}
