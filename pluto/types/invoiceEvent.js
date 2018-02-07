// @flow
import type { Invoice } from './invoice';

export type InvoiceEvent = {
  id: string,
  created: Date,
  data: {
    object: Invoice,
  },
  type: string,
};
