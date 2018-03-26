// @flow
import type { RawInvoiceItem } from './invoiceItem';

// comes in from stripe
export type RawInvoice = {
  id: string,
  object: 'invoice',
  amount_due: number,
  application_fee: ?number,
  attempt_count: number,
  attempted: boolean,
  billing: 'charge_automatically' | 'send_invoice',
  charge: string,
  closed: boolean,
  currency: string,
  customer: string,
  date: number,
  ending_balance: number,
  lines: {
    data: Array<?RawInvoiceItem>,
  },
  livemode: boolean,
  metadata: any,
  next_payment_attempt: ?number,
  number: string,
  paid: boolean,
  period_end: number,
  period_start: number,
  receipt_number: string,
  starting_balance: number,
  statement_descriptor: ?string,
  subscription: string,
  subscription_proration_date?: number,
  subtotal: number,
  tax: number,
  tax_percent: number,
  total: number,
};

// saved in db
export type CleanInvoice = {
  ...$Exact<RawInvoice>,
  customerId: string,
  invoiceId: string,
};
