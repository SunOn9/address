import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { GetZoneConditionRequest } from '@generated/zone/zone_request'
import { Type } from 'class-transformer'
import { EnumZone_ZonePartner } from '@generated/zone/zone'

export class GetZoneConditionRequestDto implements GetZoneConditionRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  zipcode?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(EnumZone_ZonePartner)
  zoneType?: EnumZone_ZonePartner

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number
}
