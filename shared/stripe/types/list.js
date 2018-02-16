// @flow
import type { Plan } from './plan';
export type List = {
  id: string,
  amount: number,
  currency: string,
  period: {
    start: Date,
    end: Date,
  },
  plan: Plan,
  proration: boolean,
  quantity: number,
  subscription_item: string,
  type: 'subscription',
};
