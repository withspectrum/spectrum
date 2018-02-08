// @flow
import type { SubscriptionEvent } from '../types/subscriptionEvent';
import type { RawSubscription } from '../types/subscription';

export const SubscriptionEventHandler = {};
SubscriptionEventHandler.handle = (
  event: SubscriptionEvent
): RawSubscription => {
  return event.data.object;
};
