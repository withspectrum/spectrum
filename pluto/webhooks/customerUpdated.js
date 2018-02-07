// @flow
import type { CustomerEvent } from '../types/customerEvent';

export const CustomerUpdatedHandler = {};
CustomerUpdatedHandler.handle = (event: CustomerEvent) => {
  // do things here
  return new Promise(res => res());
};
