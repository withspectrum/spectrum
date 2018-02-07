// @flow
import type { Customer } from './customer';

export type CustomerEvent = {
  id: string,
  created: Date,
  data: {
    object: Customer,
  },
  type: string,
};
