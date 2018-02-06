// @flow

export type CreateCustomerInput = {
  email: string,
  source: string,
};

export type UpdateCustomerInput = {
  customerId: string,
  email: string,
  source: string,
};

export type CreateSubscriptionInput = {
  customerId: string,
  plan: string,
  quantity: number,
};

export type DeleteSubscriptionInput = {
  subscriptionId: string,
};

export type Source = {
  id: string,
  brand: string,
  country: string,
  customer: string,
  cvc_check: string,
  dynamic_last4: string,
  exp_month: number,
  exp_year: number,
  fingerprint: string,
  funding: string,
  last4: string,
  name: ?string,
  tokenization_method: ?string,
};

export type SubscriptionItem = {
  id: string,
  created: Date,
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
  subscription: string,
};

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
    total_count: 1,
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

export type Customer = {
  id: string,
  created: Date,
  currency: string,
  email: ?string,
  sources: {
    data: Array<?Source>,
    has_more: boolean,
    total_count: number,
  },
  subscriptions: {
    data: Array<?Subscription>,
    has_more: boolean,
    total_count: number,
  },
};

export type State = {
  customerId: ?string,
  customer: ?Customer,
  subscriptions: ?Array<?Subscription>,
  sources: ?Array<?Source>,
};
