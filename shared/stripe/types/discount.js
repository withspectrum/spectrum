// @flow

export type RawDiscount = {
  customer: ?string,
  subscription: ?string,
  start: Date,
  end: Date,
  coupon: {
    id: string,
    created: Date,
    duration: string,
    amount_off: ?string,
    percent_off: ?string,
    valid: boolean,
  },
};
