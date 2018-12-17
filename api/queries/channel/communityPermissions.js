// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';

export default async (
  root: DBChannel,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  const communityId = root.id || root.communityId;
  const defaultPermissions = {
    isOwner: false,
    isMember: false,
    isModerator: false,
    isBlocked: false,
    isPending: false,
    receiveNotifications: false,
  };

  if (!communityId || !user) {
    return defaultPermissions;
  }

  const permissions = await loaders.userPermissionsInCommunity.load([
    user.id,
    communityId,
  ]);
  return permissions || defaultPermissions;
};
