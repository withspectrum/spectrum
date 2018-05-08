// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { processReputationEventQueue } from 'shared/bull/queues';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { deleteThread, getThreads } from '../../models/thread';
import { track } from 'shared/analytics';
import * as events from 'shared/analytics/event-types';

export default async (
  _: any,
  { threadId }: { threadId: string },
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to edit a thread
  if (!currentUser) {
    return new UserError(
      'You must be signed in to make changes to this thread.'
    );
  }

  // get the thread being locked
  const threads = await getThreads([threadId]);

  const threadToEvaluate = threads && threads[0];

  // if the thread doesn't exist
  if (!threadToEvaluate || threadToEvaluate.deletedAt) {
    return new UserError("This thread doesn't exist");
  }

  // return the thread, channels and communities
  const [
    currentUserChannelPermissions,
    currentUserCommunityPermissions,
  ] = await Promise.all([
    getUserPermissionsInChannel(threadToEvaluate.channelId, currentUser.id),
    getUserPermissionsInCommunity(threadToEvaluate.communityId, currentUser.id),
  ]);

  // if the user owns the community or the channel, or they are the original creator, they can delete the thread
  if (
    currentUserChannelPermissions.isOwner ||
    currentUserChannelPermissions.isModerator ||
    currentUserCommunityPermissions.isOwner ||
    currentUserCommunityPermissions.isModerator ||
    threadToEvaluate.creatorId === currentUser.id
  ) {
    // if the current user doing the deleting does not match the thread creator, we can assume that this deletion is happening as a moderation event. In this case we grant reputation to the moderator
    if (currentUser.id !== threadToEvaluate.creatorId) {
      processReputationEventQueue.add({
        userId: currentUser.id,
        type: 'thread deleted by moderation',
        entityId: threadToEvaluate.communityId,
      });
    }

    const deletedThread = await deleteThread(threadId);

    track(currentUser.id, events.THREAD_DELETED);

    return deletedThread;
  }

  // if the user is not a channel or community owner, the thread can't be locked
  return new UserError(
    "You don't have permission to make changes to this thread."
  );
};
