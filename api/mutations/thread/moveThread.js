// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getThread, moveThread } from '../../models/thread';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getChannels } from '../../models/channel';
import { track, events } from 'shared/analytics';

export default async (
  _: any,
  { threadId, channelId }: { threadId: string, channelId: string },
  { user }: GraphQLContext
) => {
  const currentUser = user;
  if (!currentUser)
    throw new UserError('You must be signed in to move a thread.');

  const thread = await getThread(threadId);
  if (!thread) throw new UserError('Cannot move a non-existant thread.');

  const {
    isOwner,
    isModerator,
    isBlocked,
  } = await getUserPermissionsInCommunity(thread.communityId, currentUser.id);

  if (isBlocked) {
    throw new UserError("You don't have permission to post in that channel.");
  }

  if (thread.creatorId !== currentUser.id && (!isOwner && !isModerator))
    throw new UserError(
      'You have to be a moderator or owner of the community to move a thread.'
    );

  const [newChannel] = await getChannels([channelId]);
  if (newChannel.communityId !== thread.communityId)
    throw new UserError('You can only move threads within the same community.');

  track(currentUser.id, events.THREAD_MOVED);

  return moveThread(threadId, channelId).then(res => {
    if (res) return res;

    throw new UserError(
      'Oops, something went wrong with moving the thread. Please try again!'
    );
  });
};
