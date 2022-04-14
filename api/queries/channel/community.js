// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';
import { canViewCommunity } from '../../utils/permissions';

export default async (channel: DBChannel, _: any, ctx: GraphQLContext) => {
  const { communityId } = channel;
  const { loaders, user: currentUser } = ctx;

  const community = await loaders.community.load(communityId);
  if (community.isPrivate) {
    if (await canViewCommunity(currentUser, community.id, loaders)) {
      return community;
    } else {
      return null;
    }
  }

  return community;
};
