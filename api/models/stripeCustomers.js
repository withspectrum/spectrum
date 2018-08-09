// @flow
import { db } from './db';
import type { RawCustomer } from 'shared/stripe/types/customer';
const debug = require('debug')('api:models:stripe-customers');

export const getStripeCustomer = (customerId: string): Promise<Object> => {
  return db
    .table('stripeCustomers')
    .get(customerId)
    .run();
};

// prettier-ignore
export const getStripeCustomersByCustomerIds = (customerIds: Array<string>): Promise<Array<Object>> => {
  return db
    .table('stripeCustomers')
    .getAll(...customerIds)
    .group('customerId')
    .run();
};

export const recordExists = async (customerId: string): Promise<boolean> => {
  debug(`Checking for duplicate records ${customerId}`);
  return await db
    .table('stripeCustomers')
    .getAll(customerId)
    .run()
    .then(
      result =>
        debug(`\nRecord exists for ${customerId}`) ||
        (result && result.length > 0)
    )
    .catch(err => {
      console.error('ERROR: ', err);
      return new Error(err);
    });
};

export const insertStripeCustomer = async (record: Object): Promise<any> => {
  debug(`Inserting ${record.id}`);
  const expanded = Object.assign({}, record, { customerId: record.id });
  return await db
    .table('stripeCustomers')
    .insert(expanded, { returnChanges: 'always' })
    .run()
    .then(
      result =>
        debug('\nInserted') ||
        result.changes[0].new_val ||
        result.changes[0].old_val
    )
    .catch(err => {
      console.error('ERROR: ', err);
      return new Error(err);
    });
};

// prettier-ignore
export const replaceStripeCustomer = async (customerId: string, record: Object): Promise<any> => {
  const expanded = Object.assign({}, record, { customerId: record.id });
  return await db
    .table('stripeCustomers')
    .getAll(customerId)
    .replace(expanded, { returnChanges: 'always' })
    .run()
    .then(
      result =>
        debug('\nReplaced') ||
        result.changes[0].new_val ||
        result.changes[0].old_val
    )
    .catch(err => {
      console.error('ERROR: ', err);
      return new Error(err);
    });
};

export const insertOrReplaceStripeCustomer = async (customer: RawCustomer) => {
  const exists = await recordExists(customer.id);
  if (exists) {
    debug(`Customer record exists, replacing ${customer.id}`);
    return await replaceStripeCustomer(customer.id, customer);
  } else {
    debug(`Customer does not exist, inserting ${customer.id}`);
    return await insertStripeCustomer(customer);
  }
};
