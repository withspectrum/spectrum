// @flow
import type { RawSubscriptionItem } from './subscriptionItem';
import type { RawDiscount } from './discount';

// comes in from stripe
export type RawSubscription = {
  id: string,
  object: 'subscription',
  application_fee_percent: number,
  billing: 'charge_automatically' | 'send_invoice',
  billing_cycle_anchor: number,
  cancel_at_period_end: boolean,
  canceled_at: ?number,
  created: number,
  current_period_end: number,
  current_period_start: number,
  customer: string,
  ended_at: ?number,
  discount: ?RawDiscount,
  items: {
    data: Array<?RawSubscriptionItem>,
  },
  livemode: boolean,
  metadata: any,
  plan: ?{
    id: string,
    object: 'plan',
    amount: number,
    created: number,
    currency: string,
    interval: 'day' | 'week' | 'month' | 'year',
    interval_count: number,
    livemode: boolean,
    metadata: any,
    nickname: ?string,
    product: string,
    trial_period_days: ?number,
  },
  quantity: ?number,
  start: number,
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid',
  tax_percent?: number,
  trial_end?: number,
  trial_start?: number,
};
