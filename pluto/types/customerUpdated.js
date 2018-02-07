// @flow
import type { Customer } from './customer';

export type CustomerUpdated = {
  id: string,
  created: Date,
  data: {
    object: Customer,
  },
  type: 'customer.updated',
};
