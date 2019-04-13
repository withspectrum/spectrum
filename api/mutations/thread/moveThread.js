// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getThread, moveThread } from '../../models/thread';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getChannels } from '../../models/channel';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

type Input = {
  threadId: string,
  channelId: string,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { user } = ctx;
  const { threadId, channelId } = args;

  const thread = await getThread(threadId);
  if (!thread) {
    trackQueue.add({
      userId: user.id,
      event: events.THREAD_MOVED_FAILED,
      context: { threadId },
      properties: {
        reason: 'thread not found',
      },
    });

    return new UserError('Cannot move a non-existant thread.');
  }

  const {
    isOwner,
    isModerator,
    isBlocked,
  } = await getUserPermissionsInCommunity(thread.communityId, user.id);

  if (isBlocked) {
    trackQueue.add({
      userId: user.id,
      event: events.THREAD_MOVED_FAILED,
      context: { threadId },
      properties: {
        reason: 'no permission blocked',
      },
    });

    return new UserError("You don't have permission to post in that channel.");
  }

  if (thread.creatorId !== user.id && (!isOwner && !isModerator)) {
    trackQueue.add({
      userId: user.id,
      event: events.THREAD_MOVED_FAILED,
      context: { threadId },
      properties: {
        reason: 'no permission',
      },
    });

    return new UserError(
      'You have to be a moderator or owner of the community to move a thread.'
    );
  }

  const [newChannel] = await getChannels([channelId]);
  if (newChannel.communityId !== thread.communityId) {
    trackQueue.add({
      userId: user.id,
      event: events.THREAD_MOVED_FAILED,
      context: { threadId },
      properties: {
        reason: 'moving between communities',
      },
    });

    return new UserError(
      'You can only move threads within the same community.'
    );
  }

  return moveThread(threadId, channelId, user.id).then(res => {
    if (res) return res;

    trackQueue.add({
      userId: user.id,
      event: events.THREAD_MOVED_FAILED,
      context: { threadId },
      properties: {
        reason: 'unknown error',
      },
    });

    return new UserError(
      'Oops, something went wrong with moving the thread. Please try again!'
    );
  });
});
