// @flow
import type { DBMessage } from 'shared/types';
import type { GraphQLContext } from '../../';

export default async (
  { senderId, threadId, threadType }: DBMessage,
  _: any,
  { loaders }: GraphQLContext
) => {
  // there will be no community to resolve in direct message threads, so we can escape early
  // and only return the sender
  if (threadType === 'directMessageThread') {
    const user = loaders.user.load(senderId);
    return {
      user,
    };
  }

  const [thread, user] = await Promise.all([
    loaders.thread.load(threadId),
    loaders.user.load(senderId),
  ]);

  if (!thread || !user) return null;

  let [communityPermissions = {}, channelPermissions = {}] = await Promise.all([
    loaders.userPermissionsInCommunity.load([user.id, thread.communityId]),
    loaders.userPermissionsInChannel.load([user.id, thread.channelId]),
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
