// @flow
import type { ChargeEvent } from '../types/chargeEvent';
import type { CleanCharge } from '../types/charge';

export const TransformCharge = (event: ChargeEvent): CleanCharge => {
  const charge = event.data.object;

  return Object.assign({}, charge, {
    customerId: charge.customer,
    chargeId: charge.id,
  });
};
