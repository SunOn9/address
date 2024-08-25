import { GetWardConditionRequest } from '@generated/ward/ward_request'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class GetWardConditionRequestDto implements GetWardConditionRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  wardId?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wardName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wardSlug?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  districtId?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cityId?: number

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map(each => Number(each))
      : Array(value).map(each => Number(each)),
  )
  listWardId: number[]

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
