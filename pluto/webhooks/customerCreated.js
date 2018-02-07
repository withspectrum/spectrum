// @flow
import type { CustomerEvent } from '../types/customerEvent';

export const CustomerCreatedHandler = {};
CustomerCreatedHandler.handle = (event: CustomerEvent) => {
  // do things here
  return new Promise(res => res());
};
