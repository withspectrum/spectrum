// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { setThreadLock } from '../../models/thread';
import type { DBThread } from 'shared/types';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  threadId: string,
  value: boolean,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { user, loaders } = ctx;
  const { threadId, value } = args;

  const thread: DBThread = await loaders.thread.load(threadId);

  // if the thread doesn't exist
  if (!thread || thread.deletedAt) {
    return new UserError(`Could not find thread with ID '${threadId}'.`);
  }

  // A threads author can always lock their thread, but only unlock it if
  // it was locked by themselves. (if a mod locks a thread an author cannot
  // unlock it anymore)
  const isAuthor = thread.creatorId === user.id;
  const authorCanLock =
    !thread.isLocked || thread.lockedBy === thread.creatorId;
  if (isAuthor && authorCanLock) {
    const event = thread.lockedAt
      ? events.THREAD_UNLOCKED
      : events.THREAD_LOCKED;
    trackQueue.add({
      userId: user.id,
      event,
      context: { threadId },
    });
    return setThreadLock(threadId, value, user.id);
  }

  // get the channel permissions
  let [
    currentUserChannelPermissions,
    currentUserCommunityPermissions,
  ] = await Promise.all([
    loaders.userPermissionsInChannel.load([user.id, thread.channelId]),
    loaders.userPermissionsInCommunity.load([user.id, thread.communityId]),
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
    const event = thread.lockedAt
      ? events.THREAD_UNLOCKED_BY_MODERATOR
      : events.THREAD_LOCKED_BY_MODERATOR;
    trackQueue.add({
      userId: user.id,
      event,
      context: { threadId },
    });
    return setThreadLock(threadId, value, user.id);
  }

  // if the user is not a channel or community owner, the thread can't be locked
  if (isAuthor) {
    return new UserError(
      "You don't have permission to unlock this thread as it was locked by a moderator."
    );
  }
  return new UserError(
    "You don't have permission to make changes to this thread."
  );
});
