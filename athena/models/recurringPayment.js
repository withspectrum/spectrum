// @flow
const { db } = require('./db');

export const getRecurringPaymentFromInvoice = (
  invoice: Object
): Promise<Object> => {
  console.log('finding invoice', invoice);
  return db
    .table('recurringPayments')
    .filter({
      planId: invoice.planId,
      customerId: invoice.customerId,
    })
    .run()
    .then(result => (result.length > 0 ? result[0] : null));
};
