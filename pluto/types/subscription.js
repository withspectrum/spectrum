// @flow
import type { SubscriptionItem } from './subscriptionItem';

export type Subscription = {
  id: string,
  billing: string,
  billing_cycle_anchor: Date,
  cancel_at_period_end: boolean,
  canceled_at: ?Date,
  created: Date,
  current_period_end: Date,
  current_period_start: Date,
  customer: string,
  ended_at: ?Date,
  items: {
    data: Array<?SubscriptionItem>,
    has_more: boolean,
    total_count: number,
  },
  plan: {
    id: string,
    amount: number,
    created: Date,
    currency: string,
    interval: string,
    interval_count: number,
    name: string,
  },
  quantity: number,
  start: Date,
  status: 'active' | 'canceled',
};
