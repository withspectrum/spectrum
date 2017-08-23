// @flow
import { db } from './db';
import { addQueue } from '../utils/workerQueue';

export const getInvoice = (id: string): Promise<Array<Object>> => {
  return db.table('invoices').get(id).run();
};

export const getInvoicesByCommunity = (id: string): Promise<Array<Object>> => {
  return db.table('invoices').getAll(id, { index: 'communityId' }).run();
};

export const payInvoice = (id, stripeData): Promise<Object> => {
  return db
    .table('invoices')
    .get(id)
    .update({
      paidAt: new Date(),
      stripeData,
    })
    .run()
    .then(() => db.table('invoices').get(id).run())
    .then(invoice => {
      addQueue('community invoice paid notification', { invoice });
      return invoice;
    });
};
