// @flow
import type { RawSource } from './source';

export type SourceEvent = {
  id: string,
  created: Date,
  data: {
    object: RawSource,
  },
  type: string,
};
