export class StateEntity {
  stateId: number

  stateName: string

  countryId: number

  constructor(partial: Partial<StateEntity>) {
    Object.assign(this, partial)
  }
}
