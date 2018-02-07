// @flow
import type { Subscription } from './subscription';

export type SubscriptionCreated = {
  id: string,
  created: Date,
  data: {
    object: Subscription,
  },
  type: 'customer.subscription.created',
};
