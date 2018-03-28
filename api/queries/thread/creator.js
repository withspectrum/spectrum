// @flow
/*

    DEPRECATED 2/3/2018 by @brian

*/
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';

export default async (
  { creatorId, communityId }: DBThread,
  _: any,
  { loaders }: GraphQLContext
) => {
  const creator = await loaders.user.load(creatorId);

  const permissions = await loaders.userPermissionsInCommunity.load([
    creatorId,
    communityId,
  ]);

  return {
    ...creator,
    contextPermissions: {
      communityId,
      reputation: permissions ? permissions.reputation : 0,
      isModerator: permissions ? permissions.isModerator : false,
      isOwner: permissions ? permissions.isOwner : false,
      isBlocked: permissions ? permissions.isBlocked : false,
    },
  };
};
