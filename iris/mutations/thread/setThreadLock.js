// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getThreads, setThreadLock } from '../../models/thread';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';

export default async (
  _: any,
  { threadId, value }: { threadId: string, value: boolean },
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to edit a thread
  if (!currentUser) {
    return new UserError('You must be signed in to make changes.');
  }

  const thread = await loaders.thread.load(threadId);

  // if the thread doesn't exist
  if (!thread || thread.deletedAt) {
    return new UserError(`Could not find thread with ID '${threadId}'.`);
  }

  // get the channel permissions
  let [
    currentUserChannelPermissions,
    currentUserCommunityPermissions,
  ] = await Promise.all([
    loaders.userPermissionsInChannel.load([currentUser.id, thread.channelId]),
    loaders.userPermissionsInCommunity.load([
      currentUser.id,
      thread.communityId,
    ]),
  ]);

  if (!currentUserChannelPermissions) currentUserChannelPermissions = {};
  if (!currentUserCommunityPermissions) currentUserCommunityPermissions = {};

  // user owns the community or the channel, they can lock the thread
  if (
    currentUserChannelPermissions.isOwner ||
    currentUserChannelPermissions.isModerator ||
    currentUserCommunityPermissions.isOwner ||
    currentUserCommunityPermissions.isModerator
  ) {
    return setThreadLock(threadId, value);
  }

  // if the user is not a channel or community owner, the thread can't be locked
  return new UserError(
    "You don't have permission to make changes to this thread."
  );
};
