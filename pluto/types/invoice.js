// @flow
import type { List } from './list';

export type Invoice = {
  id: string,
  amount_due: number,
  attempt_count: number,
  attempted: boolean,
  billing: string,
  charge: string,
  closed: boolean,
  currency: string,
  customer: string,
  date: Date,
  ending_balance: number,
  lines: {
    data: Array<?List>,
    has_more: boolean,
    total_count: number,
  },
  paid: boolean,
  period_end: Date,
  period_start: Date,
  subscription: string,
  subtotal: number,
  tax: number,
  tax_percent: number,
  total: number,
};
