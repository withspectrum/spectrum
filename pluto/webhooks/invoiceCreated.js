// @flow
import type { InvoiceCreated } from '../types/invoiceCreated';

export const InvoiceCreatedHandler = {};
InvoiceCreatedHandler.handle = (event: InvoiceCreated) => {
  // do things here
  return new Promise(res => res());
};
