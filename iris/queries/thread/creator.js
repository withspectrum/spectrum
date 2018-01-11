// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';

export default async (
  { creatorId, communityId }: DBThread,
  _: any,
  { loaders }: GraphQLContext
) => {
  const [creator, permissions] = await Promise.all([
    loaders.user.load(creatorId),
    loaders.userPermissionsInCommunity.load([creatorId, communityId]),
  ]);

  return {
    ...creator,
    contextPermissions: {
      communityId,
      reputation: permissions ? permissions.reputation : 0,
      isModerator: permissions ? permissions.isModerator : false,
      isOwner: permissions ? permissions.isOwner : false,
    },
  };
};
