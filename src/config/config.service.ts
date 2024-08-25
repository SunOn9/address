import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MyConfigService {
  zoneChartUrl = this.configService.get<string>('ZONE_CHART_URL')

  constructor(private configService: ConfigService) {}
}
