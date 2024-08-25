import { UpdateZoneData, UpdateZoneRequest } from '@generated/zone/zone_request'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { EnumZone_ZonePartner } from '@generated/zone/zone'

export class UpdateZoneRequestDto implements UpdateZoneRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  zipcode!: number

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EnumZone_ZonePartner)
  zoneType: EnumZone_ZonePartner

  @ApiProperty()
  @IsNotEmpty()
  data!: UpdateZoneData

  constructor(partial: Partial<UpdateZoneRequestDto>) {
    Object.assign(this, partial)
  }
}
