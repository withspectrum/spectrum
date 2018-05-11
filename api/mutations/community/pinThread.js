// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getThreadById } from '../../models/thread';
import { setPinnedThreadInCommunity } from '../../models/community';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';

type Input = {
  threadId: string,
  communityId: string,
  value: string,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { threadId, communityId, value } = args;
  const { user, loaders } = ctx;

  const eventFailed = value
    ? events.THREAD_PINNED_FAILED
    : events.THREAD_UNPINNED_FAILED;

  if (!await canModerateCommunity(user.id, communityId, loaders)) {
    trackQueue.add({
      userId: user.id,
      event: eventFailed,
      context: { threadId },
      properties: {
        reason: 'no permission',
      },
    });

    return new UserError("You don't have permission to do this.");
  }

  const thread = await getThreadById(threadId);

  if (!thread) {
    trackQueue.add({
      userId: user.id,
      event: eventFailed,
      context: { threadId },
      properties: {
        reason: 'thread not found',
      },
    });

    return new UserError('This thread has been deleted');
  }

  const channel = await loaders.channel.load(thread.channelId);

  if (channel.isPrivate) {
    trackQueue.add({
      userId: user.id,
      event: eventFailed,
      context: { threadId },
      properties: {
        reason: 'private channel thread',
      },
    });

    return new UserError('Only threads in public channels can be pinned.');
  }

  return setPinnedThreadInCommunity(communityId, value, user.id);
});
