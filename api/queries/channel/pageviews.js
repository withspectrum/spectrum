// @flow
import type { DBChannel } from 'shared/types';
import { getAggregatedViews } from '../../models/pageviews';

export default async ({ id }: DBChannel, _: any) => {
  return getAggregatedViews({ id, pageviewType: 'channel' });
};
