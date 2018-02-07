// @flow
import type { CustomerCreated } from '../types/customerCreated';

export const CustomerCreatedHandler = {};
CustomerCreatedHandler.handle = (event: CustomerCreated) => {
  // do things here
  return new Promise(res => res());
};
