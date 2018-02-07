// @flow
import type { SubscriptionEvent } from '../types/subscriptionEvent';

export const CustomerSubscriptionCreatedHandler = {};
CustomerSubscriptionCreatedHandler.handle = (event: SubscriptionEvent) => {
  // do things here
  return new Promise(res => res());
};
