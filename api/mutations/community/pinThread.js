// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getThreadById } from '../../models/thread';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { setPinnedThreadInCommunity } from '../../models/community';
import { getChannels } from '../../models/channel';
import { events } from 'shared/analytics';
import { getEntityDataForAnalytics } from '../../utils/analytics';

type PinThreadInput = {
  threadId: string,
  communityId: string,
  value: string,
};

export default async (
  _: any,
  { threadId, communityId, value }: PinThreadInput,
  { user, loaders, track }: GraphQLContext
) => {
  const currentUser = user;
  if (!currentUser) {
    return new UserError(
      'You must be signed in to pin a thread in this community.'
    );
  }

  const defaultTrackingData = await getEntityDataForAnalytics(loaders)({
    threadId,
    userId: user.id,
  });

  const [permissions, threadToEvaluate] = await Promise.all([
    getUserPermissionsInCommunity(communityId, currentUser.id),
    getThreadById(threadId),
  ]);

  if (!permissions.isOwner && !permissions.isModerator) {
    return new UserError("You don't have permission to do this.");
  }

  // we have to ensure the thread isn't in a private channel
  const channels = await getChannels([threadToEvaluate.channelId]);

  if (channels && channels[0].isPrivate) {
    return new UserError('Only threads in public channels can be pinned.');
  }

  const event = value ? events.THREAD_PINNED : events.THREAD_UNPINNED;

  track(event, defaultTrackingData);

  return setPinnedThreadInCommunity(communityId, value);
};
