import { ApiProperty } from '@nestjs/swagger'
import { GetZoneChartRequest } from '@generated/common'
import { IsNotEmpty, IsString } from 'class-validator'

export class GetZoneChartDto implements GetZoneChartRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  zipCode3Digit: string
}
