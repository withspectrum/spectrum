// @flow
import type { Subscription } from './subscription';

export type SubscriptionEvent = {
  id: string,
  created: Date,
  data: {
    object: Subscription,
  },
  type: string,
};
