// @flow
import type { RawPlan } from './plan';

export type RawSubscriptionItem = {
  id: string,
  object: 'list',
  created: number,
  plan: RawPlan,
  quantity: number,
  subscription: string,
};
