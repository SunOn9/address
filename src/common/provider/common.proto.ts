/* eslint-disable @typescript-eslint/naming-convention */
import { GetZoneChartColumnData, GetZoneChartReply } from '@generated/common'
import { Injectable } from '@nestjs/common'

export type GetZoneChartDataApi = {
  ZIPCodeError: string
  ShippingDateError: string
  PageError: string
  EffectiveDate: string
  Column0: ZoneChartData[]
  Column1: ZoneChartData[]
  Column2: ZoneChartData[]
  Column3: ZoneChartData[]
  Zip5Digit: ZoneChartData[]
}

export type ZoneChartData = {
  ZipCodes: string
  Zone: string
  MailService: string
}

@Injectable()
export class ZoneChartReflect {
  reflect(dataApi: GetZoneChartDataApi): GetZoneChartReply {
    const reflect = GetZoneChartReply.create()

    reflect.zipCodeError = dataApi.ZIPCodeError
    reflect.shippingDateError = dataApi.ShippingDateError
    reflect.pageError = dataApi.PageError
    reflect.effectiveDate = dataApi.EffectiveDate
    reflect.column0 = this.convertData(dataApi.Column0)
    reflect.column1 = this.convertData(dataApi.Column1)
    reflect.column2 = this.convertData(dataApi.Column2)
    reflect.column3 = this.convertData(dataApi.Column3)
    reflect.zip5Digit = this.convertData(dataApi.Zip5Digit)

    return reflect
  }

  private convertData(dataApi: ZoneChartData[]): GetZoneChartColumnData[] {
    return dataApi.map(each =>
      GetZoneChartColumnData.create({
        zipCodes: each.ZipCodes,
        zone: this.removeAllOperators(each.Zone),
        mailService: each.MailService,
      }),
    )
  }

  private removeAllOperators(str: string) {
    const regex = /[+*]/g
    return str.replace(regex, '')
  }
}
