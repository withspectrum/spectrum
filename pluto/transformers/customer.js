// @flow
import type { CustomerEvent } from '../types/customerEvent';

export const TransformCustomer = (event: CustomerEvent) => {
  const customer = event.data.object;

  return Object.assign({}, customer, {
    customerId: customer.id,
  });
};
