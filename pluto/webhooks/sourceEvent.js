// @flow
import type { SourceEvent } from '../types/sourceEvent';
import type { RawSource } from '../types/source';

export const SourceEventHandler = {};
SourceEventHandler.handle = (event: SourceEvent): RawSource => {
  return event.data.object;
};
