// @flow
import type { Source } from './source';

export type SourceEvent = {
  id: string,
  created: Date,
  data: {
    object: Source,
  },
  type: string,
};
