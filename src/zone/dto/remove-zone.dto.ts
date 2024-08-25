import { EnumZone_ZonePartner } from '@generated/zone/zone'
import { RemoveZoneRequest } from '@generated/zone/zone_request'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator'

export class RemoveZoneRequestDto implements RemoveZoneRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  zipcode!: number

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EnumZone_ZonePartner)
  zoneType: EnumZone_ZonePartner

  constructor(partial: Partial<RemoveZoneRequestDto>) {
    Object.assign(this, partial)
  }
}
