// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import { getPageViews } from '../../models/pageviews';

export default ({ id }: DBCommunity, _: any, { loaders }: GraphQLContext) => {
  return getPageViews({ id, pageviewType: 'community' });
};
