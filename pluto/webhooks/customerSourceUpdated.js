// @flow
import type { SourceEvent } from '../types/sourceEvent';

export const CustomerSourceUpdatedHandler = {};
CustomerSourceUpdatedHandler.handle = (event: SourceEvent) => {
  // do things here
  return new Promise(res => res());
};
