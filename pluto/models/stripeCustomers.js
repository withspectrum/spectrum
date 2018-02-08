// @flow
import type { CleanCustomer } from '../types/customer';
import { recordExists, insertRecord, replaceRecord } from './utils';

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
