export class CityEntity {
  cityId: number

  cityName: string

  citySlug: string

  grant: string

  stateId?: number

  countryId: number

  constructor(partial: Partial<CityEntity>) {
    Object.assign(this, partial)
  }
}
