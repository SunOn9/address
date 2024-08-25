import {
  EnumZone_ZonePartner,
  enumZone_ZonePartnerToNumber,
} from '@generated/zone/zone'
import { Injectable } from '@nestjs/common'

// import {ZONE_INTERVAL_TREE_KEY} from './zone.constant'

@Injectable()
export class ZoneFunction {
  numberToZip3(data: number): string {
    return data.toString().padStart(3, '0')
  }

  numberToZip5(data: number): string {
    return data.toString().padStart(3, '0') + '00'
  }

  zip3ToZip5(data: string): string {
    return `${data}00`
  }

  genId(zipcode: string, type: EnumZone_ZonePartner) {
    const idString = `${zipcode}${enumZone_ZonePartnerToNumber(type)}`
    return parseInt(idString, 10)
  }

  // genKeyIntervalTree(zipcode: string, zoneType: EnumZone_ZonePartner): string {
  //   return `${ZONE_INTERVAL_TREE_KEY}::${zipcode}::${zoneType}`
  // }

  genKeyTree(zipcode: number | string, zoneType: EnumZone_ZonePartner): string {
    switch (typeof zipcode) {
      case 'string': {
        return `${zipcode}::${zoneType}`
      }
      case 'number': {
        return `${this.numberToZip3(zipcode)}::${zoneType}`
      }
      default: {
        return ''
      }
    }
  }

  genKeyTreeException(
    zipcode: number | string,
    zoneType: EnumZone_ZonePartner,
  ): string {
    switch (typeof zipcode) {
      case 'string': {
        return `${this.zip3ToZip5(zipcode)}::${zoneType}`
      }
      case 'number': {
        return `${this.numberToZip5(zipcode)}::${zoneType}`
      }
      default: {
        return ''
      }
    }
  }
}
