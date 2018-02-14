// @flow
import { db } from './db';

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
