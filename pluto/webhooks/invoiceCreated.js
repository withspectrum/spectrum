// @flow
import type { InvoiceEvent } from '../types/invoiceEvent';

export const InvoiceCreatedHandler = {};
InvoiceCreatedHandler.handle = (event: InvoiceEvent) => {
  // do things here
  return new Promise(res => res());
};
