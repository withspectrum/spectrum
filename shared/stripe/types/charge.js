// @flow
import type { RawSource } from './source';

// comes in from stripe
export type RawCharge = {
  id: string,
  object: 'charge',
  amount: number,
  amount_refunded: number,
  application: ?string,
  application_fee: ?number,
  balance_transaction: string,
  capture: boolean,
  created: number,
  currency: string,
  customer: string,
  description: ?string,
  destination: ?string,
  dispute: ?string,
  failure_code: ?string,
  failure_message: ?string,
  fraud_details: {
    user_report?: 'safe' | 'fraudulent',
    stripe_report?: 'fraudulent',
  },
  invoice: string,
  livemode: boolean,
  metadata: any,
  on_behalf_of: ?string,
  order: ?string,
  outcome: {
    network_status: string,
    reason: ?string,
    risk_level: string,
    seller_message: string,
    type: string,
  },
  paid: boolean,
  receipt_email: ?string,
  receipt_number: ?number,
  refunded: boolean,
  refunds: any,
  review: ?string,
  shipping: any,
  source: RawSource,
  source_transfer: ?string,
  statement_descriptor: ?string,
  status: 'succeeded' | 'pending' | 'failed',
  transfer?: ?string,
  transfer_group: ?string,
};

// saved in our db
export type CleanCharge = {
  ...$Exact<RawCharge>,
  customerId: string,
  chargeId: string,
};
