// @flow
import type { Source } from './source';
import type { Subscription } from './subscription';
export type Customer = {
  id: string,
  created: Date,
  currency: string,
  email: ?string,
  sources: {
    data: Array<?Source>,
    has_more: boolean,
    total_count: number,
  },
  subscriptions: {
    data: Array<?Subscription>,
    has_more: boolean,
    total_count: number,
  },
};
