import { Injectable } from '@nestjs/common'
import { District } from '@generated/district/district'
import { DistrictEntity } from '../entities/district.entity'

@Injectable()
export class DistrictReflect {
  reflect(entity: DistrictEntity): District {
    const reflect = District.create()
    reflect.districtId = entity.districtId ?? 0
    reflect.cityId = entity.cityId ?? 0
    reflect.districtName = entity.districtName ?? ''
    reflect.districtSlug = entity.districtSlug ?? ''
    reflect.grant = entity.grant ?? ''
    return reflect
  }
}
