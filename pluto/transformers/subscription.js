// @flow
import type { SubscriptionEvent } from '../types/subscriptionEvent';

export const TransformSubscription = (event: SubscriptionEvent) => {
  const subscription = event.data.object;

  return Object.assign({}, subscription, {
    customerId: subscription.customer,
  });
};
