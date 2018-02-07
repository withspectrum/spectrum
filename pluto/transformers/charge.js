// @flow
import type { ChargeEvent } from '../types/chargeEvent';

export const TransformCharge = (event: ChargeEvent) => {
  const charge = event.data.object;

  return Object.assign({}, charge, {
    customerId: charge.customer,
  });
};
