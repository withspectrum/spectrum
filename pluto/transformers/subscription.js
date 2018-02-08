// @flow
import type { RawSubscription, CleanSubscription } from '../types/subscription';

export const TransformSubscription = (
  subscription: RawSubscription
): CleanSubscription => {
  return Object.assign({}, subscription, {
    customerId: subscription.customer,
    subscriptionId: subscription.id,
  });
};
