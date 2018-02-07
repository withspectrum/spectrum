// @flow
import type { Charge } from './charge';

export type ChargeSucceeded = {
  id: string,
  created: Date,
  data: {
    object: Charge,
  },
  type: 'charge.succeeded',
};
