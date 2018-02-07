// @flow
import type { InvoicePaymentSucceeded } from '../types/invoicePaymentSucceeded';

export const InvoicePaymentSucceededHandler = {};
InvoicePaymentSucceededHandler.handle = (event: InvoicePaymentSucceeded) => {
  // do things here
  return new Promise(res => res());
};
