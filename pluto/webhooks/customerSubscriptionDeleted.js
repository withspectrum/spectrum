// @flow
import type { SubscriptionEvent } from '../types/subscriptionEvent';

export const CustomerSubscriptionDeletedHandler = {};
CustomerSubscriptionDeletedHandler.handle = (event: SubscriptionEvent) => {
  // do things here
  return new Promise(res => res());
};
