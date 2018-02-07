// @flow
import type { Plan } from './plan';

export type SubscriptionItem = {
  id: string,
  created: Date,
  plan: Plan,
  quantity: number,
  subscription: string,
};
