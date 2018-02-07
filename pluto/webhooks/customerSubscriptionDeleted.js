// @flow
import type { CustomerSubscriptionDeleted } from '../types/customerSubscriptionDeleted';

export const CustomerSubscriptionDeletedHandler = {};
CustomerSubscriptionDeletedHandler.handle = (
  event: CustomerSubscriptionDeleted
) => {
  // do things here
  return new Promise(res => res());
};
