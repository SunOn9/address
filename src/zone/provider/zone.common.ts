import * as CONST from './zone.constant'

export function getKeyNameWalletRefund(id: number): string {
  return CONST.CACHE_KEY + '::' + id
}
