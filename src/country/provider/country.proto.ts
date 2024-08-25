import { Country } from '@generated/country/country'
import { Injectable } from '@nestjs/common'
import { CountryEntity } from '../entities/country.entity'

@Injectable()
export class CountryReflect {
  reflect(entity: CountryEntity): Country {
    const reflect = Country.create()
    reflect.countryId = entity.countryId ?? 0
    reflect.countryName = entity.countryName ?? ''
    return reflect
  }
}
