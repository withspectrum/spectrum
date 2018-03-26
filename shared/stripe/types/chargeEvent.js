// @flow
import type { RawCharge } from './charge';

export type ChargeEvent = {
  id: string,
  created: Date,
  data: {
    object: RawCharge,
  },
  type: string,
};
