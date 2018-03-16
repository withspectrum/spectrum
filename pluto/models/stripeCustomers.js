// @flow
import type { CleanCustomer } from 'shared/stripe/types/customer';
import { recordExists, insertRecord, replaceRecord } from './utils';
import { db } from 'iris/models/db';
import type { DBStripeCustomer } from 'shared/types';

export const saveCustomer = async (
  customer: CleanCustomer
): Promise<CleanCustomer> => {
  const table = 'stripeCustomers';
  const key = customer.customerId;

  if (await recordExists(table, key)) {
    return replaceRecord(table, key, customer);
  } else {
    return insertRecord(table, customer);
  }
};

export const getStripeCustomer = (
  customerId: string
): Promise<DBStripeCustomer> => {
  return db
    .table('stripeCustomers')
    .get(customerId)
    .run();
};
