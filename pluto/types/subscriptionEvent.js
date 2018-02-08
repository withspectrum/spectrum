// @flow
import type { RawSubscription } from './subscription';

export type SubscriptionEvent = {
  id: string,
  created: Date,
  data: {
    object: RawSubscription,
  },
  type: string,
};
