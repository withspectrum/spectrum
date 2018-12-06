// @flow
import { getThreadTagsByCommunity } from '../../models/threadTags';
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';

export default (
  community: DBCommunity,
  _: void,
  { loaders }: GraphQLContext
) => {
  return getThreadTagsByCommunity(community.id);
};
