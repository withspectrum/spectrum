// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';

export default (
  { communityId }: DBThread,
  _: any,
  { loaders }: GraphQLContext
) => loaders.community.load(communityId);
