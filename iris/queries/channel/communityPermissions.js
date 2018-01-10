// @flow
import type { GraphQLContext } from '../../';

export default (args, _: any, { user, loaders }: GraphQLContext) => {
  const communityId = args.id || args.communityId;
  if (!communityId || !user) {
    return {
      isOwner: false,
      isMember: false,
      isModerator: false,
      isBlocked: false,
      isPending: false,
      receiveNotifications: false,
    };
  }
  return loaders.userPermissionsInCommunity.load([user.id, communityId]);
};
