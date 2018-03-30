// @flow
import type { RawSource } from './source';
import type { RawSubscription } from './subscription';
import type { RawDiscount } from './discount';

// comes in from stripe
export type RawCustomer = {
  id: string,
  object: 'customer',
  account_balance: ?number,
  created: number,
  currency: string,
  default_source: string,
  delinquent: boolean,
  description: ?string,
  discount: ?RawDiscount,
  email: ?string,
  invoice_prefix: string,
  livemode: boolean,
  metadata: ?{
    communityId?: string,
    communityName?: string,
  },
  shipping: ?any,
  sources: {
    data: Array<?RawSource>,
  },
  subscriptions: {
    data: Array<?RawSubscription>,
  },
};

// saved in our db
export type CleanCustomer = {
  ...$Exact<RawCustomer>,
  customerId: string,
};
