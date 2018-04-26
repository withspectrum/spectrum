// @flow
import createLoaders from '../../loaders/';
const loaders = createLoaders();

export const userCanManageChannel = async (
  userId: string,
  channelId: string
): Promise<boolean> => {
  if (!userId || !channelId) return false;

  const channel = await loaders.channel.load(channelId);

  if (!channel || channel.deletedAt) return false;
  const [communityPermissions, channelPermissions] = await Promise.all([
    loaders.userPermissionsInCommunity.load([userId, channel.communityId]),
    loaders.userPermissionsInChannel.load([userId, channelId]),
  ]);

  if (!communityPermissions) return false;
  if (communityPermissions.isOwner || communityPermissions.isModerator)
    return true;
  if (!channelPermissions) return false;
  if (channelPermissions.isOwner || channelPermissions.isModerator) return true;
  return false;
};

export const userCanCreateChannel = async (
  userId: string,
  communityId: string
): Promise<boolean> => {
  if (!userId || !communityId) return false;
  const permissions = loaders.userPermissionsInCommunity.load([
    userId,
    communityId,
  ]);
  if (!permissions || !permissions.isOwner) return false;
  return true;
};
