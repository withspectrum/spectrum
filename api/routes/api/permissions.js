// @flow
export default (userId: string, loaders: any) => ({
  communityPermissions: (communityId: string) =>
    loaders.userPermissionsInCommunity.load([userId, communityId]),
  channelPermissions: (channelId: string) =>
    loaders.userPermissionsInChannel.load([userId, channelId]),
  canManageChannel: (channelId: string) =>
    canManageChannel(userId, channelId, loaders),
  canCreateChannel: (channelId: string) =>
    canCreateChannel(userId, channelId, loaders),
});

const canManageChannel = async (
  userId: string,
  channelId: string,
  loaders: any
) => {
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

const canCreateChannel = async (
  userId: string,
  communityId: string,
  loaders: any
) => {
  if (!userId || !communityId) return false;
  const permissions = loaders.userPermissionsInCommunity.load([
    userId,
    communityId,
  ]);
  if (!permissions) return false;
  if (permissions.isOwner || permissions.isModerator) return true;
  return false;
};
