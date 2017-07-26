// @flow
import { db } from './db';
// $FlowFixMe
// const createQueue = require('../../shared/bull/create-queue');
// const communityInvoicePaidNotificationQueue = createQueue('community invoice paid notification');

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
      // communityInvoicePaidNotificationQueue.add({ invoice });
      return invoice;
    });
};
