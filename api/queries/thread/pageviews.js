// @flow
import type { DBThread } from 'shared/types';
import { getAggregatedViews } from '../../models/pageviews';

export default async ({ id }: DBThread, _: any) => {
  return getAggregatedViews({ id, pageviewType: 'thread' });
};
