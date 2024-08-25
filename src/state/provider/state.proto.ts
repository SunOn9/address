import { Injectable } from '@nestjs/common'
import { State } from '@generated/state/state'
import { StateEntity } from '../entities/state.entity'

@Injectable()
export class StateReflect {
  reflect(entity: StateEntity): State {
    const reflect = State.create()
    reflect.stateId = entity.stateId ?? 0
    reflect.stateName = entity.stateName ?? ''
    reflect.countryId = entity.countryId ?? 0
    return reflect
  }
}
