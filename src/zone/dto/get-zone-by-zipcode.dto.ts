import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { GetZoneByZipcodeRequest } from '@generated/zone/zone_request'
import { EnumZone_ZonePartner } from '@generated/zone/zone'

export class GetZoneByZipcodeRequestDto implements GetZoneByZipcodeRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  zipcodeFrom: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  zipcodeTo: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EnumZone_ZonePartner)
  zoneType: EnumZone_ZonePartner
}
