// @flow
import { db } from './db';
import { addQueue } from '../utils/workerQueue';

export const getInvoice = (id: string): Promise<Array<Object>> => {
  return db.table('invoices').get(id).run();
};

export const getInvoicesByCommunity = (id: string): Promise<Array<Object>> => {
  return db.table('invoices').getAll(id, { index: 'communityId' }).run();
};

export const createInvoice = (
  event: Object,
  subscription: Object
): Promise<Object> => {
  return db
    .table('invoices')
    .insert(
      {
        status: event.paid ? 'paid' : 'unpaid',
        customerId: event.customer,
        subscriptionId: event.subscription,
        amount: event.total,
        planId: subscription.plan.id,
        planName: subscription.plan.name,
        quantity: subscription.quantity,
        paidAt: event.date,
        chargeId: event.charge,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
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
