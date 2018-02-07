// @flow
import type { Source } from './source';
export type Charge = {
  id: string,
  amount: number,
  amount_refunded: number,
  captured: boolean,
  created: Date,
  currency: string,
  customer: string,
  failure_code: ?string,
  failure_message: ?string,
  invoice: string,
  paid: boolean,
  receipt_email: ?string,
  receipt_number: ?string,
  refunded: boolean,
  source: Source,
  status: 'succeeded' | 'pending' | 'failed',
};
