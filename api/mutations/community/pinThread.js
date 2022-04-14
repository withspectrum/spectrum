// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getThreadById } from '../../models/thread';
import { setPinnedThreadInCommunity } from '../../models/community';
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

  if (!(await canModerateCommunity(user.id, communityId, loaders))) {
    return new UserError("You don't have permission to do this.");
  }

  const thread = await getThreadById(threadId);

  if (!thread) {
    return new UserError('This thread has been deleted');
  }

  const channel = await loaders.channel.load(thread.channelId);

  if (channel.isPrivate) {
    return new UserError('Only threads in public channels can be pinned.');
  }

  return setPinnedThreadInCommunity(communityId, value, user.id);
});
