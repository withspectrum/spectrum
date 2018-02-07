// @flow
import type { Source } from './source';

export type CustomerSourceCreated = {
  id: string,
  created: Date,
  data: {
    object: Source,
  },
  type: 'customer.source.created',
};
