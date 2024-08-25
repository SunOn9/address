import { Injectable } from '@nestjs/common'
import { City } from '@generated/city/city'
import { CityEntity } from '../entities/city.entity'

@Injectable()
export class CityReflect {
  reflect(entity: CityEntity): City {
    const reflect = City.create()
    reflect.cityId = entity.cityId ?? 0
    reflect.cityName = entity.cityName ?? ''
    reflect.citySlug = entity.citySlug ?? ''
    reflect.grant = entity.grant ?? ''
    reflect.stateId = entity.stateId ?? 0
    reflect.countryId = entity.countryId ?? 0
    return reflect
  }
}
