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
    debug(`Customer record exists, replacing ${customer.id}`);
    return await replaceRecord(table, key, customer, filter);
  } else {
    debug(`Customer record does not exist, inserting ${customer.id}`);
    return await insertRecord(table, customer);
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

  return await Promise.all([
    SourceEventFactory.resetCustomerSources(cleanCustomer.customerId),
    SubscriptionEventFactory.resetCustomerSubscriptions(
      cleanCustomer.customerId
    ),
  ])
    .then(async () => {
      debug(
        `Done cleaning sources and subscriptions for ${
          cleanCustomer.customerId
        }`
      );
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

      const [result] = await Promise.all([
        save(cleanCustomer),
        sourcePromises,
        subscriptionPromises,
      ]);

      debug(`Returning result for customer event ${cleanCustomer.customerId}`);

      return result;
    })
    .catch(err => {
      console.log(`Error handling customer event ${event.data.object.id}`);
      throw new Error(err);
    });
};
