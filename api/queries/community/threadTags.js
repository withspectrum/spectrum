// @flow
import { getThreadTagsByCommunity } from '../../models/threadTags';
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';

export default (
  community: DBCommunity,
  _: void,
  { loaders }: GraphQLContext
) => {
  // TODO(@mxstbr): Use a loader
  return getThreadTagsByCommunity(community.id);
};
