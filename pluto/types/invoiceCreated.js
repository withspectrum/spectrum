// @flow
import type { Invoice } from './invoice';

export type InvoiceCreated = {
  id: string,
  created: Date,
  data: {
    object: Invoice,
  },
  type: 'invoice.created',
};
