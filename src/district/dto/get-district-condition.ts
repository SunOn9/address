import { Transform, Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { GetDistrictConditionRequest } from '@generated/district/district_request'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class GetDistrictConditionRequestDto
  implements GetDistrictConditionRequest
{
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  districtId?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  districtName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  districtSlug?: string

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
  listDistrictId: number[]

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
