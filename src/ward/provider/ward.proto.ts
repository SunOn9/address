import { Ward } from '@generated/ward/ward'
import { Injectable } from '@nestjs/common'
import { WardEntity } from '../entities/ward.entity'

@Injectable()
export class WardReflect {
  reflect(entity: WardEntity): Ward {
    const reflect = Ward.create()
    reflect.wardId = entity.wardId ?? 0
    reflect.districtId = entity.districtId ?? 0
    reflect.cityId = entity.cityId ?? 0
    reflect.wardName = entity.wardName ?? ''
    reflect.wardSlug = entity.wardSlug ?? ''
    reflect.grant = entity.grant ?? ''
    return reflect
  }
}
