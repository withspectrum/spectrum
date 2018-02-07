// @flow
import type { Customer } from './customer';

export type CustomerCreated = {
  id: string,
  created: Date,
  data: {
    object: Customer,
  },
  type: 'customer.created',
};
