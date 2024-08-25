import { Transform, Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { GetCityConditionRequest } from '@generated/city/city_request'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class GetCityConditionRequestDto implements GetCityConditionRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cityId?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cityName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  citySlug?: string

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map(each => Number(each))
      : Array(value).map(each => Number(each)),
  )
  listCountryId: number[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  countryId?: number

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map(each => Number(each))
      : Array(value).map(each => Number(each)),
  )
  listStateId: number[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  stateId?: number

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map(each => Number(each))
      : Array(value).map(each => Number(each)),
  )
  listCityId: number[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number
}
