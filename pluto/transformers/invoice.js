// @flow
import type { InvoiceEvent } from '../types/invoiceEvent';

export const TransformInvoice = (event: InvoiceEvent) => {
  const invoice = event.data.object;

  return Object.assign({}, invoice, {
    customerId: invoice.customer,
  });
};
