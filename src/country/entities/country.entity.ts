export class CountryEntity {
  countryId: number

  countryName: string

  constructor(partial: Partial<CountryEntity>) {
    Object.assign(this, partial)
  }
}
