// @flow
import type { InvoiceEvent } from '../types/invoiceEvent';

export const InvoicePaymentSucceededHandler = {};
InvoicePaymentSucceededHandler.handle = (event: InvoiceEvent) => {
  // do things here
  return new Promise(res => res());
};
