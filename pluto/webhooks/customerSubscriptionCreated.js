// @flow
import type { CustomerSubscriptionCreated } from '../types/customerSubscriptionCreated';

export const CustomerSubscriptionCreatedHandler = {};
CustomerSubscriptionCreatedHandler.handle = (
  event: CustomerSubscriptionCreated
) => {
  // do things here
  return new Promise(res => res());
};
