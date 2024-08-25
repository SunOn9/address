import { MyConfigService } from '@/config/config.service'
import { GetZoneChartReply } from '@generated/common'
import { HttpStatus, Injectable } from '@nestjs/common'
import { GetZoneChartDto } from './dto/get-zone-chart.dto'
import { err, ok, Result } from 'neverthrow'
import { getZoneChartAPI } from './provider/common.get-zone-chart'
import { HttpService } from '@nestjs/axios'
import { GetZoneChartDataApi, ZoneChartReflect } from './provider/common.proto'

@Injectable()
export class CommonService {
  constructor(
    private configService: MyConfigService,
    private readonly httpService: HttpService,
    private readonly reflect: ZoneChartReflect,
  ) {}

  async getZoneChartAPI(
    request: GetZoneChartDto,
  ): Promise<Result<GetZoneChartReply, Error>> {
    try {
      const url = getZoneChartAPI(request, this.configService.zoneChartUrl)
      const resp = await this.httpService.axiosRef.get<GetZoneChartDataApi>(url)
      if (resp.status === HttpStatus.OK) {
        return ok(this.reflect.reflect(resp.data))
      }
    } catch (errors) {
      if (errors.instance)
        return err(new Error(errors.message || errors.detail || errors.title))
    }

    return err(new Error(`Cannot call api`))
  }
}
