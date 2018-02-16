// @flow
const debug = require('debug')('pluto:webhooks:customerEvent');
import type { CleanCustomer, RawCustomer } from 'shared/stripe/types/customer';
import type { Job, StripeWebhookEventJobData } from 'shared/bull/types';
import { recordExists, insertRecord, replaceRecord } from '../models/utils';

const cleanCustomer = (customer: RawCustomer): CleanCustomer => {
  debug(`Cleaning customer ${customer.id}`);
  // eslint-disable-next-line
  return Object.assign({}, customer, {
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
  raw: RawCustomer
): Promise<CleanCustomer> => {
  debug(`Handling customer ${raw.id}`);
  const cleanCustomer = clean(raw);
  const result = await save(cleanCustomer);

  debug(`Returning result for customer event ${cleanCustomer.customerId}`);
  return result;
};

export default async (job: Job<StripeWebhookEventJobData>) => {
  const { data: { record } } = job;
  debug(`New job for ${record.id}`);
  return await CustomerEventHandler.handle(record);
};
