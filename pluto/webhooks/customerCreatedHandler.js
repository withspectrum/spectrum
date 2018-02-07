// @flow
import type { EventType } from '../types';

export const CustomerCreatedHandler = {};
CustomerCreatedHandler.handle = (event: EventType) => {
  // do things here
  return new Promise(res => res());
};
