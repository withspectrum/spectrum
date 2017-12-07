// @flow
const { db } = require('./db');
import type { DBInvoice, DBRecurringPayment } from 'shared/types';

export const getRecurringPaymentFromInvoice = (
  invoice: DBInvoice
): Promise<?DBRecurringPayment> => {
  return db
    .table('recurringPayments')
    .filter({
      planId: invoice.planId,
      customerId: invoice.customerId,
    })
    .run()
    .then(result => (result.length > 0 ? result[0] : null));
};
