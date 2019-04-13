// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';

export default async (
  root: DBChannel,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  const channelId = root.id;
  const defaultPermissions = {
    isOwner: false,
    isMember: false,
    isModerator: false,
    isBlocked: false,
    isPending: false,
    receiveNotifications: false,
  };

  if (!channelId || !user) {
    return defaultPermissions;
  }

  const permissions = await loaders.userPermissionsInChannel.load([
    user.id,
    channelId,
  ]);

  return permissions || defaultPermissions;
};
