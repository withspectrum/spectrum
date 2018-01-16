// @flow
import type { GraphQLContext } from '../../';

export default (
  { communityId }: { communityId: string },
  _: any,
  { loaders }: GraphQLContext
) => loaders.community.load(communityId);
