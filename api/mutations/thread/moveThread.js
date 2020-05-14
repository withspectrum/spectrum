// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getThread, moveThread } from '../../models/thread';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getChannelById } from '../../models/channel';
import {
  getCommunityById,
  setPinnedThreadInCommunity,
} from '../../models/community';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  threadId: string,
  channelId: string,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { user } = ctx;
  const { threadId, channelId } = args;

  const thread = await getThread(threadId);

  if (!thread) {
    return new UserError('Cannot move a non-existent thread.');
  }

  const {
    isOwner,
    isModerator,
    isBlocked,
  } = await getUserPermissionsInCommunity(thread.communityId, user.id);

  if (isBlocked) {
    return new UserError("You don't have permission to post in that channel.");
  }

  if (thread.creatorId !== user.id && (!isOwner && !isModerator)) {
    return new UserError(
      'You have to be a moderator or owner of the community to move a thread.'
    );
  }

  const [newChannel, community] = await Promise.all([
    getChannelById(channelId),
    getCommunityById(thread.communityId),
  ]);

  if (newChannel.communityId !== thread.communityId) {
    return new UserError(
      'You can only move threads within the same community.'
    );
  }

  // if the thread is being moved into a private channel, make sure it is not pinned
  // in the community
  if (
    newChannel.isPrivate &&
    community.pinnedThreadId &&
    thread.id === community.pinnedThreadId
  ) {
    await setPinnedThreadInCommunity(thread.communityId, null, user.id);
  }

  return moveThread(threadId, channelId).then(res => {
    if (res) return res;

    return new UserError(
      'Oops, something went wrong with moving the thread. Please try again!'
    );
  });
});
