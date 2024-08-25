import { CommonService } from '@/common/common.service'
import { ZoneRepository } from '../provider/zone.repository'
import { Process, Processor } from '@nestjs/bull'
import { DoneCallback, Job } from 'bull'
import { PROCESS_ZONE_INIT_USPS, QUEUE_ZONE } from '../provider/zone.constant'
import { ZoneData } from '@generated/zone/zone'
import { GetZoneChartColumnData } from '@generated/common'
import {
  EnumZone_ZonePartner,
  enumZone_ZonePartnerToNumber,
} from '@generated/zone/zone'
import { ZoneService } from '../zone.service'
import { ZoneFunction } from '@/zone/provider/zone.function'
import { RedisPubSubService } from 'libs/core/components/redis/redis-pubsub.service'

@Processor(QUEUE_ZONE)
export class ZoneProcessor {
  constructor(
    private readonly repo: ZoneRepository,
    private readonly commonService: CommonService,
    private readonly zoneService: ZoneService,
    private readonly redisPubSubService: RedisPubSubService,
    private readonly zoneFunction: ZoneFunction,
  ) {}

  @Process(PROCESS_ZONE_INIT_USPS)
  async handleZoneProcessInitUSPS(job: Job<string>, cb: DoneCallback) {
    const zip3 = job.data
    const timestamp = Math.round(Date.now() / 1000)

    const resp = await this.commonService.getZoneChartAPI({
      zipCode3Digit: zip3,
    })

    if (resp.isErr()) {
      cb(resp.error, null)
      return
    }

    const { column0, column1, column2, column3, zip5Digit } = resp.value

    const data = this.zoneChartApiDataToZoneData(
      column0.concat(column1, column2, column3),
    )

    const exceptionData = this.zoneChartApiDataToZoneData(zip5Digit)

    const createResp = await this.repo.createZone({
      id: this.zoneFunction.genId(zip3, EnumZone_ZonePartner.USPS_PARTNER),
      zipcode: parseInt(zip3),
      createdDate: timestamp,
      updatedDate: timestamp,
      data: JSON.stringify(data),
      exceptionData: JSON.stringify(exceptionData),
      zoneType: enumZone_ZonePartnerToNumber(EnumZone_ZonePartner.USPS_PARTNER),
    })

    if (createResp.isErr()) {
      cb(createResp.error, null)
      return
    }

    // await this.delay(1000)

    cb(null, 'Its work')
  }

  private zoneChartApiDataToZoneData(
    apiData: GetZoneChartColumnData[],
  ): ZoneData[] {
    return apiData.map(data => {
      const zipcodes = data.zipCodes.split('---')

      return ZoneData.create({
        zipcodeFrom: parseInt(zipcodes[0]),
        zipcodeTo: parseInt(zipcodes[1]),
        zone: data.zone,
      })
    })
  }

  // private async delay(ms: number) {
  //   return new Promise(resolve => setTimeout(resolve, ms))
  // }
}
