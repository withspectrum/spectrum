// @flow

// comes in from stripe
export type RawSource = {
  id: string,
  object: 'source',
  amount: ?number,
  client_secret: string,
  created: number,
  currency: ?string,
  customer: string,
  flow: 'redirect' | 'receiver' | 'code_verification' | 'none',
  livemode: boolean,
  metadata: any,
  owner: any,
  statement_descriptor: ?string,
  status: 'chargeable' | 'canceled' | 'consumed' | 'failed' | 'pending',
  type: string,
  card?: {
    exp_month: number,
    exp_year: number,
    address_zip_check: 'pass' | 'fail' | 'unavailable' | 'unchecked',
    brand:
      | 'American Express'
      | 'Diners Club'
      | 'Discover'
      | 'JCB'
      | 'MasterCard'
      | 'UnionPay'
      | 'Visa'
      | 'Unknown',
    card_automatically_updated: boolean,
    country: string,
    cvc_check: void | 'pass' | 'fail' | 'unavailable' | 'unchecked',
    fingerprint: string,
    funding: 'credit' | 'debit' | 'prepaid' | 'unknown',
    last4: string,
  },
};

// saved in db
export type CleanSource = {
  ...$Exact<RawSource>,
  customerId: string,
  sourceId: string,
};
