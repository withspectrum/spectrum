// @flow
export type Source = {
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
};
