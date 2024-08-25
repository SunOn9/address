export class DistrictEntity {
  districtId: number

  cityId: number

  districtName: string

  districtSlug: string

  grant: string

  constructor(partial: Partial<DistrictEntity>) {
    Object.assign(this, partial)
  }
}
