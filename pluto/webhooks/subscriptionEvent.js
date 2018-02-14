// @flow
const debug = require('debug')('pluto:webhooks:subscriptionEvent');
import type { SubscriptionEvent } from '../types/SubscriptionEvent';
import type { CleanSubscription, RawSubscription } from '../types/subscription';
import { recordExists, insertRecord, replaceRecord } from '../models/utils';
import { resetCustomerSubscriptions } from '../models/stripeSubscriptions';

const cleanSubscription = (
  subscription: RawSubscription
): CleanSubscription => {
  debug(`Cleaning subscription ${subscription.id}`);
  return Object.assign({}, subscription, {
    customerId: subscription.customer,
    subscriptionId: subscription.id,
  });
};

const saveSubscription = async (
  subscription: CleanSubscription
): Promise<CleanSubscription> => {
  debug(`Saving subscription ${subscription.id}`);
  const table = 'stripeSubscriptions';
  const key = subscription.customerId;
  const filter = { customerId: key };

  if (await recordExists(table, key, filter)) {
    debug(`Subscription record exists, replacing ${subscription.id}`);
    return await replaceRecord(table, key, subscription, filter);
  } else {
    debug(`Subscription record does not exist, inserting ${subscription.id}`);
    return await insertRecord(table, subscription);
  }
};

export const SubscriptionEventFactory = {
  clean: (raw: RawSubscription): CleanSubscription => cleanSubscription(raw),
  save: async (clean: CleanSubscription): Promise<CleanSubscription> =>
    await saveSubscription(clean),
  resetCustomerSubscriptions: async (customerId: string) =>
    await resetCustomerSubscriptions(customerId),
};

export const SubscriptionEventHandler = {};

const { clean, save } = SubscriptionEventFactory;

SubscriptionEventHandler.handle = async (
  event: SubscriptionEvent
): Promise<CleanSubscription> => {
  debug(`Handling subscription ${event.data.object.id}`);
  return await save(clean(event.data.object)).catch(err => {
    console.log(`Error handling subscription event ${event.data.object.id}`);
    throw new Error(err);
  });
};
