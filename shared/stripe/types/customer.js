// @flow
import type { RawSource } from './source';
import type { RawSubscription } from './subscription';

// comes in from stripe
export type RawCustomer = {
  id: string,
  created: Date,
  currency: string,
  email: ?string,
  default_source: ?string,
  sources: {
    data: Array<?RawSource>,
    has_more: boolean,
    total_count: number,
  },
  subscriptions: {
    data: Array<?RawSubscription>,
    has_more: boolean,
    total_count: number,
  },
};

// saved in our db
export type CleanCustomer = {
  id: string,
  customerId: string,
  created: Date,
  currency: string,
  email: ?string,
  sources: {
    data: Array<?RawSource>,
    has_more: boolean,
    total_count: number,
  },
  subscriptions: {
    data: Array<?RawSubscription>,
    has_more: boolean,
    total_count: number,
  },
};
