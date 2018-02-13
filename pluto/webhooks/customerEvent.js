// @flow
const debug = require('debug')('pluto:webhooks:customerEvent');
import type { CustomerEvent } from '../types/CustomerEvent';
import type { CleanCustomer, RawCustomer } from '../types/customer';
import { recordExists, insertRecord, replaceRecord } from '../models/utils';
import { SourceEventFactory } from './sourceEvent';
import { SubscriptionEventFactory } from './subscriptionEvent';

const cleanCustomer = (customer: RawCustomer): CleanCustomer => {
  debug(`Cleaning customer ${customer.id}`);
  // eslint-disable-next-line
  const { sources, subscriptions, ...rest } = customer;
  return Object.assign({}, rest, {
    customerId: customer.id,
  });
};

const saveCustomer = async (
  customer: CleanCustomer
): Promise<CleanCustomer> => {
  debug(`Saving customer ${customer.id}`);
  const table = 'stripeCustomers';
  const key = customer.customerId;
  const filter = { customerId: key };

  if (await recordExists(table, key, filter)) {
    return replaceRecord(table, key, customer, filter);
  } else {
    return insertRecord(table, customer);
  }
};

export const CustomerEventFactory = {
  clean: (raw: RawCustomer): CleanCustomer => cleanCustomer(raw),
  save: async (clean: CleanCustomer): Promise<CleanCustomer> =>
    await saveCustomer(clean),
};

export const CustomerEventHandler = {};

const { clean, save } = CustomerEventFactory;

CustomerEventHandler.handle = async (
  event: CustomerEvent
): Promise<CleanCustomer> => {
  debug(`Handling customer ${event.data.object.id}`);

  const rawCustomer = event.data.object;
  const { sources, subscriptions } = rawCustomer;

  const cleanCustomer = clean(event.data.object);

  const sourcePromises = sources.data.map(
    async source =>
      source &&
      (await SourceEventFactory.save(SourceEventFactory.clean(source)))
  );
  const subscriptionPromises = subscriptions.data.map(
    async subscription =>
      subscription &&
      (await SubscriptionEventFactory.save(
        SubscriptionEventFactory.clean(subscription)
      ))
  );

  const [result, _, __] = await Promise.all([
    save(cleanCustomer),
    sourcePromises,
    subscriptionPromises,
  ]);

  return result;
};
