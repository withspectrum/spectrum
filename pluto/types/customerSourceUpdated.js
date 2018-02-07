// @flow
import type { Source } from './source';

export type CustomerSourceUpdated = {
  id: string,
  created: Date,
  data: {
    object: Source,
  },
  type: 'customer.source.updated',
};
