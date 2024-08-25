import { GetCountryConditionRequest } from '@generated/country/country_request'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class GetCountryConditionRequestDto
  implements GetCountryConditionRequest
{
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  countryId?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  countryName?: string

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
