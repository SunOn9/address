import { Injectable } from '@nestjs/common'
import { ZoneEntity } from '../entities/zone.entity'
import { Zone, ZoneData } from '@generated/zone/zone'
import {
  EnumZone_ZonePartner,
  enumZone_ZonePartnerFromJSON,
} from '@generated/zone/zone'
import { UtilsService } from '@lib/utils'

@Injectable()
export class ZoneReflect {
  constructor(private readonly utilsService: UtilsService) {}

  reflect(entity: ZoneEntity): Zone {
    const reflect = Zone.create()
    reflect.id = entity.id ?? 0
    reflect.zipcode = entity.zipcode ?? 0
    reflect.data = this.utilsService.isJSONStringify(entity.data)
      ? JSON.parse(entity.data).map((each: any) => ZoneData.fromJSON(each))
      : []
    reflect.exceptionData = this.utilsService.isJSONStringify(
      entity.exceptionData,
    )
      ? JSON.parse(entity.exceptionData).map((each: any) =>
          ZoneData.fromJSON(each),
        )
      : []
    reflect.createdDate = entity.createdDate ?? 0
    reflect.updatedDate = entity.updatedDate ?? 0
    reflect.isDeleted = entity.isDeleted ?? false
    reflect.zoneType = entity.zoneType
      ? enumZone_ZonePartnerFromJSON(entity.zoneType)
      : EnumZone_ZonePartner.UNRECOGNIZED
    return reflect
  }
}
