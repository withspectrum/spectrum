// @flow
import { db } from './db';
import {
  sendCommunityInvoicePaidNotificationQueue,
  sendProInvoicePaidNotificationQueue,
} from 'shared/bull/queues';

export const getInvoice = (id: string): Promise<Array<Object>> => {
  return db
    .table('invoices')
    .get(id)
    .run();
};

export const getInvoicesByCommunity = (id: string): Promise<Array<Object>> => {
  return db
    .table('invoices')
    .getAll(id, { index: 'communityId' })
    .run();
};

export const getInvoicesByUser = (id: string): Promise<Array<Object>> => {
  return db
    .table('invoices')
    .getAll(id, { index: 'userId' })
    .filter({ planId: 'beta-pro' })
    .run();
};

export const createInvoice = (
  event: Object,
  subscription: Object,
  customer: Object,
  recurringPayment: Object
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
        sourceBrand: customer.sources.data[0].brand,
        sourceLast4: customer.sources.data[0].last4,
        communityId: recurringPayment.communityId,
        userId: recurringPayment.userId,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => {
      const queue =
        subscription.plan.id === 'community-standard'
          ? sendCommunityInvoicePaidNotificationQueue
          : sendProInvoicePaidNotificationQueue;

      const invoice = result.changes[0].new_val;

      // trigger an email to the user for the invoice receipt
      queue.add({ invoice });
      return invoice;
    });
};

export const getInvoiceByChargeId = (chargeId: string): Promise<Boolean> => {
  return db
    .table('invoices')
    .filter({ chargeId })
    .run()
    .then(result => {
      if (!result || result.length === 0) return false;
      return true;
    });
};
