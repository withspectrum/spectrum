// @flow
import type { SourceEvent } from '../types/sourceEvent';

export const TransformSource = (event: SourceEvent) => {
  const source = event.data.object;

  return Object.assign({}, source, {
    customerId: source.customer,
  });
};
