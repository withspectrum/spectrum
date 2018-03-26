// @flow

export type RawDiscount = {
  object: 'discount',
  customer: ?string,
  subscription: ?string,
  start: number,
  end: number,
  coupon: {
    id: string,
    created: Date,
    duration: string,
    amount_off: ?string,
    percent_off: ?string,
    valid: boolean,
  },
};
