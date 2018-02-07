// @flow
import type { CustomerUpdated } from '../types/customerUpdated';

export const CustomerUpdatedHandler = {};
CustomerUpdatedHandler.handle = (event: CustomerUpdated) => {
  // do things here
  return new Promise(res => res());
};
