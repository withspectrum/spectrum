// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getThreads, setThreadLock } from '../../models/thread';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import type { DBThread } from 'shared/types';

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

  const thread: DBThread = await loaders.thread.load(threadId);

  // if the thread doesn't exist
  if (!thread || thread.deletedAt) {
    return new UserError(`Could not find thread with ID '${threadId}'.`);
  }

  // A threads author can always lock their thread, but only unlock it if
  // it was locked by themselves. (if a mod locks a thread an author cannot
  // unlock it anymore)
  const isAuthor = thread.creatorId === currentUser.id;
  // NOTE(@mxstbr): thread.isLocked === true is there for historic reasons, going forward thread.isLocked
  // will either be false or a user ID
  const authorCanLock =
    !thread.isLocked ||
    thread.isLocked === true ||
    thread.isLocked === thread.creatorId;
  if (isAuthor && authorCanLock) {
    return setThreadLock(threadId, value, currentUser.id);
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
    return setThreadLock(threadId, value, currentUser.id);
  }

  // if the user is not a channel or community owner, the thread can't be locked
  return new UserError(
    "You don't have permission to make changes to this thread."
  );
};
