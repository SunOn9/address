import { Transform, Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { GetStateConditionRequest } from '@generated/state/state_request'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class GetStateConditionRequestDto implements GetStateConditionRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  stateId?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stateName?: string

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
  page?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number
}
