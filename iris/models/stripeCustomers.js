// @flow
import { db } from './db';
import type { RawCustomer } from 'shared/stripe/types/customer';

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

export const replaceStripeCustomer = async (
  customer: RawCustomer
): Promise<any> => {
  const expanded = Object.assign({}, customer, { customerId: customer.id });
  return await db
    .table('stripeCustomers')
    .getAll(customer.id)
    .replace(expanded, { returnChanges: 'always' })
    .run()
    .then(
      result =>
        result.changes.length > 0 &&
        (result.changes[0].new_val || result.changes[0].old_val)
    )
    .catch(err => {
      console.log('ERROR: ', err);
      return new Error(err);
    });
};
