// @flow
import type { RawInvoice } from './invoice';

export type InvoiceEvent = {
  id: string,
  created: Date,
  data: {
    object: RawInvoice,
  },
  type: string,
};
