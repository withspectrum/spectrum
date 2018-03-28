// @flow
import { db } from './db';

export const getInvoices = (
  invoices: Array<string>
): Promise<Array<?Object>> => {
  return db
    .table('stripeInvoices')
    .getAll(...invoices)
    .run();
};

// prettier-ignore
export const getInvoicesByCustomerId = async (customerId: ?string): Promise<Array<?Object>> => {
  if (!customerId) return Promise.resolve([]);
  return db
    .table('stripeInvoices')
    .getAll(customerId, { index: 'customerId' })
    .run();
};
