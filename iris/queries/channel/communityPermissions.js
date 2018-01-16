// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';

export default (root: DBChannel, _: any, { user, loaders }: GraphQLContext) => {
  const communityId = root.id || root.communityId;
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
