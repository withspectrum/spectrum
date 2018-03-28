// @flow
import type { RawPlan } from './plan';

export type RawInvoiceItem = {
  id: string,
  object: 'line_item',
  amount: number,
  currency: string,
  description: string,
  discountable: boolean,
  invoice_item: string,
  livemode: boolean,
  metadata: any,
  period: {
    end: number,
    start: number,
  },
  plan: RawPlan,
  proration: boolean,
  quantity: number,
  subscription: string,
  subscription_item: string,
  type: 'invoiceitem' | 'subscription',
};
