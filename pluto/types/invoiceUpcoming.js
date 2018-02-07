// @flow
import type { Invoice } from './invoice';

export type InvoicePaymentSucceeded = {
  id: string,
  created: Date,
  data: {
    object: Invoice,
  },
  type: 'invoice.upcoming',
};
