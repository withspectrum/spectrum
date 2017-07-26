// @flow
import { db } from './db';
// $FlowFixMe
const createQueue = require('../../shared/bull/create-queue');
const paidInvoiceNotificationQueue = createQueue('invoice paid notification');

export const getInvoice = (id: string): Promise<Array<Object>> => {
  return db.table('invoices').get(id).run();
};

export const getInvoicesByCommunity = (id: string): Promise<Array<Object>> => {
  return db.table('invoices').getAll(id, { index: 'communityId' }).run();
};

export const payInvoice = (input): Promise<Object> => {
  return db
    .table('invoices')
    .get(input.id)
    .update({
      paidAt: new Date(),
    })
    .run()
    .then(result => result.changes[0].new_val);
};
