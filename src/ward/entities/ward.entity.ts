export class WardEntity {
  wardId: number

  districtId: number

  cityId: number

  wardName: string

  wardSlug: string

  grant: string

  constructor(partial: Partial<WardEntity>) {
    Object.assign(this, partial)
  }
}
