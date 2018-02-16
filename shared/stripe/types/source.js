// @flow

// comes in from stripe
export type RawSource = {
  id: string,
  brand: string,
  country: string,
  customer: string,
  cvc_check: string,
  dynamic_last4: ?string,
  exp_month: number,
  exp_year: number,
  fingerprint: string,
  funding: string,
  last4: string,
  name: ?string,
  tokenization_method: ?string,
  status: 'canceled' | 'chargeable' | 'consumed' | 'failed' | 'pending',
};

// saved in db
export type CleanSource = {
  ...$Exact<RawSource>,
  customerId: string,
  sourceId: string,
};
