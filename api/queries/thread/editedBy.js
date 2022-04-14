// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';

export default async (
  { editedBy, communityId, channelId }: DBThread,
  _: any,
  { loaders }: GraphQLContext
) => {
  if (!editedBy) return null;
  let [
    user,
    communityPermissions = {},
    channelPermissions = {},
  ] = await Promise.all([
    loaders.user.load(editedBy),
    loaders.userPermissionsInCommunity.load([editedBy, communityId]),
    loaders.userPermissionsInChannel.load([editedBy, channelId]),
  ]);

  if (!communityPermissions) communityPermissions = {};
  if (!channelPermissions) channelPermissions = {};

  const isMember = communityPermissions.isMember || channelPermissions.isMember;
  const isOwner = communityPermissions.isOwner;
  const isModerator =
    communityPermissions.isModerator || channelPermissions.isModerator;
  const isBlocked =
    channelPermissions.isBlocked || communityPermissions.isBlocked;
  const reputation = communityPermissions.reputation;

  const roles = [];
  if (isModerator) roles.push('moderator');
  if (isOwner) roles.push('admin');
  if (isBlocked) roles.push('blocked');

  return {
    id: communityPermissions.id,
    user,
    isOwner,
    isModerator,
    isBlocked,
    isMember,
    reputation,
    roles,
  };
};
