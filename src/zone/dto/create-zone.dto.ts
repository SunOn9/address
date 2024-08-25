import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator'
import { CreateZoneRequest } from '@generated/zone/zone_request'
import { ZoneData } from '@generated/zone/zone'
import { EnumZone_ZonePartner } from '@generated/zone/zone'

export class CreateZoneRequestDto implements CreateZoneRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  zipcode: string

  @ApiProperty()
  @IsNotEmptyObject()
  data: ZoneData[]

  @ApiProperty()
  @IsNotEmptyObject()
  exceptionData: ZoneData[]

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EnumZone_ZonePartner)
  zoneType: EnumZone_ZonePartner
}
