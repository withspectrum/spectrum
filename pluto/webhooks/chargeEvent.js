// @flow
import type { ChargeEvent } from '../types/chargeEvent';
import type { RawCharge } from '../types/charge';

export const ChargeEventHandler = {};
ChargeEventHandler.handle = (event: ChargeEvent): RawCharge => {
  return event.data.object;
};
