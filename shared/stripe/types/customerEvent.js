// @flow
import type { RawCustomer } from './customer';

export type CustomerEvent = {
  id: string,
  created: Date,
  data: {
    object: RawCustomer,
  },
  type: string,
};
