// @flow
import type { DBCommunity } from 'shared/types';
import { getAggregatedViews } from '../../models/pageviews';

export default async ({ id }: DBCommunity, _: any) => {
  return getAggregatedViews({ id, pageviewType: 'community' });
};
