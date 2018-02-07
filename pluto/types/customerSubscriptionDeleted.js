// @flow
import type { Subscription } from './subscription';

export type CustomerSubscriptionDeleted = {
  id: string,
  created: Date,
  data: {
    object: Subscription,
  },
  type: 'customer.subscription.deleted',
};
