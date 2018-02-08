// @flow
import type { RawSource, CleanSource } from '../types/source';

export const TransformSource = (source: RawSource): CleanSource => {
  return Object.assign({}, source, {
    customerId: source.customer,
    sourceId: source.id,
  });
};
