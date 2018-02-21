// @flow
import { db } from './db';
import type { RawCustomer } from 'shared/stripe/types/customer';
const debug = require('debug')('iris:models:stripe-customers');

export const getStripeCustomer = (customerId: string): Promise<Object> => {
  return db
    .table('stripeCustomers')
    .get(customerId)
    .run();
};

export const getStripeCustomersByCustomerIds = (
  customerIds: Array<string>
): Promise<Array<Object>> => {
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
      console.log('ERROR: ', err);
      return new Error(err);
    });
};

export const insertStripeCustomer = async (record: Object): Promise<any> => {
  debug(`Inserting ${record.id}`);
  return await db
    .table('stripeCustomers')
    .insert(record, { returnChanges: 'always' })
    .run()
    .then(
      result =>
        debug('\nInserted') ||
        result.changes[0].new_val ||
        result.changes[0].old_val
    )
    .catch(err => {
      console.log('ERROR: ', err);
      return new Error(err);
    });
};

export const replaceStripeCustomer = async (
  customerId: string,
  record: Object
): Promise<any> => {
  return await db
    .table('stripeCustomers')
    .getAll(customerId)
    .replace(record, { returnChanges: 'always' })
    .run()
    .then(
      result =>
        debug('\nReplaced') ||
        result.changes[0].new_val ||
        result.changes[0].old_val
    )
    .catch(err => {
      console.log('ERROR: ', err);
      return new Error(err);
    });
};

export const insertOrReplaceStripeCustomer = async (customer: RawCustomer) => {
  const exists = await recordExists(customer.id);
  const expanded = Object.assign({}, customer, { customerId: customer.id });
  if (exists) {
    debug(`Customer record exists, replacing ${customer.id}`);
    return await replaceStripeCustomer(customer.id, expanded);
  } else {
    debug(`Customer does not exist, inserting ${customer.id}`);
    return await insertStripeCustomer(expanded);
  }
};
