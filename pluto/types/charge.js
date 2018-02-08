// @flow
import type { RawSource } from './source';

// comes in from stripe
export type RawCharge = {
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
  source: RawSource,
  status: 'succeeded' | 'pending' | 'failed',
};

// saved in our db
export type CleanCharge = {
  ...$Exact<RawCharge>,
  customerId: string,
  chargeId: string,
};
