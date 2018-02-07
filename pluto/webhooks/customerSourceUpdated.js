// @flow
import type { CustomerSourceUpdated } from '../types/customerSourceUpdated';

export const CustomerSourceUpdatedHandler = {};
CustomerSourceUpdatedHandler.handle = (event: CustomerSourceUpdated) => {
  // do things here
  return new Promise(res => res());
};
