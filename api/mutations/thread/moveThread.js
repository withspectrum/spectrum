// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getThread, moveThread } from '../../models/thread';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getChannels } from '../../models/channel';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  threadId: string,
  channelId: string,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { user } = ctx;
  const { threadId, channelId } = args;

  const thread = await getThread(threadId);
  if (!thread) throw new UserError('Cannot move a non-existant thread.');

  const {
    isOwner,
    isModerator,
    isBlocked,
  } = await getUserPermissionsInCommunity(thread.communityId, user.id);

  if (isBlocked) {
    throw new UserError("You don't have permission to post in that channel.");
  }

  if (thread.creatorId !== user.id && (!isOwner && !isModerator))
    throw new UserError(
      'You have to be a moderator or owner of the community to move a thread.'
    );

  const [newChannel] = await getChannels([channelId]);
  if (newChannel.communityId !== thread.communityId)
    throw new UserError('You can only move threads within the same community.');

  return moveThread(threadId, channelId, user.id).then(res => {
    if (res) return res;

    throw new UserError(
      'Oops, something went wrong with moving the thread. Please try again!'
    );
  });
});
