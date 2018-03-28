// @flow

export type RawPlan = {
  id: string,
  object: 'plan',
  amount: number,
  created: Date,
  currency: string,
  interval: string,
  interval_count: number,
  livemode: boolean,
  metadata: any,
  name: string,
  product: string,
};
