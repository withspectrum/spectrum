// @flow
import type { Charge } from './charge';

export type ChargeEvent = {
  id: string,
  created: Date,
  data: {
    object: Charge,
  },
  type: string,
};
