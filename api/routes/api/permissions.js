// @flow
import type { DBChannel, DBCommunity } from 'shared/types';

export default (userId: string, loaders: any) => ({
  communityPermissions: (communityId: string): Promise<boolean> =>
    loaders.userPermissionsInCommunity.load([userId, communityId]),
  channelPermissions: (channelId: string): Promise<boolean> =>
    loaders.userPermissionsInChannel.load([userId, channelId]),
  canAdministerChannel: (channelId: string): Promise<boolean> =>
    canAdministerChannel(userId, channelId, loaders),
  canModerateChannel: (channelId: string): Promise<boolean> =>
    canModerateChannel(userId, channelId, loaders),
  canAdministerCommunity: (communityId: string): Promise<boolean> =>
    canAdministerCommunity(userId, communityId, loaders),
  canModerateCommunity: (channelId: string): Promise<boolean> =>
    canModerateCommunity(userId, channelId, loaders),
});

const channelExists = async (
  channelId: string,
  loaders: any
): Promise<?DBChannel> => {
  const channel = await loaders.channel.load(channelId);
  if (!channel || channel.deletedAt) return null;
  return channel;
};

const communityExists = async (
  communityId: string,
  loaders: any
): Promise<?DBCommunity> => {
  const community = await loaders.community.load(communityId);
  if (!community || community.deletedAt) return null;
  return community;
};

const canAdministerChannel = async (
  userId: string,
  channelId: string,
  loaders: any
) => {
  if (!userId || !channelId) return false;

  const channel = await channelExists(channelId, loaders);
  if (!channel) return false;

  const [communityPermissions, channelPermissions] = await Promise.all([
    loaders.userPermissionsInCommunity.load([userId, channel.communityId]),
    loaders.userPermissionsInChannel.load([userId, channelId]),
  ]);

  if (!communityPermissions) return false;
  if (communityPermissions.isOwner || communityPermissions.isModerator)
    return true;
  if (!channelPermissions) return false;
  if (channelPermissions.isOwner) return true;

  return false;
};

const canModerateChannel = async (
  userId: string,
  channelId: string,
  loaders: any
) => {
  if (!userId || !channelId) return false;

  const channel = await channelExists(channelId, loaders);
  if (!channel) return false;

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

const canAdministerCommunity = async (
  userId: string,
  communityId: string,
  loaders: any
) => {
  if (!userId || !communityId) return false;

  const community = await communityExists(communityId, loaders);
  if (!community) return false;

  const communityPermissions = await loaders.userPermissionsInCommunity.load([
    userId,
    communityId,
  ]);

  if (communityPermissions && communityPermissions.isOwner) return true;
  return false;
};

const canModerateCommunity = async (
  userId: string,
  communityId: string,
  loaders: any
) => {
  if (!userId || !communityId) return false;

  const community = await communityExists(communityId, loaders);
  if (!community) return false;

  const communityPermissions = await loaders.userPermissionsInCommunity.load([
    userId,
    communityId,
  ]);

  if (!communityPermissions) return false;
  if (communityPermissions.isOwner || communityPermissions.isModerator)
    return true;
  return false;
};
