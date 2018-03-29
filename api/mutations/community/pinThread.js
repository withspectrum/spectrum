// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getThreads } from '../../models/thread';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { setPinnedThreadInCommunity } from '../../models/community';
import { getChannels } from '../../models/channel';

type PinThreadInput = {
  threadId: string,
  communityId: string,
  value: string,
};

export default async (
  _: any,
  { threadId, communityId, value }: PinThreadInput,
  { user }: GraphQLContext
) => {
  const currentUser = user;
  if (!currentUser) {
    return new UserError(
      'You must be signed in to pin a thread in this community.'
    );
  }

  const [permissions, threads] = await Promise.all([
    getUserPermissionsInCommunity(communityId, currentUser.id),
    getThreads([threadId]),
  ]);

  if (!permissions.isOwner && !permissions.isModerator) {
    return new UserError("You don't have permission to do this.");
  }

  const threadToEvaluate = threads[0];

  // we have to ensure the thread isn't in a private channel
  const channels = await getChannels([threadToEvaluate.channelId]);

  if (channels && channels[0].isPrivate) {
    return new UserError('Only threads in public channels can be pinned.');
  }
  return setPinnedThreadInCommunity(communityId, value);
};
