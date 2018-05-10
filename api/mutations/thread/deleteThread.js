// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { processReputationEventQueue } from 'shared/bull/queues';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { deleteThread, getThreads } from '../../models/thread';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  threadId: string,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { user } = ctx;
  const { threadId } = args;

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
    getUserPermissionsInChannel(threadToEvaluate.channelId, user.id),
    getUserPermissionsInCommunity(threadToEvaluate.communityId, user.id),
  ]);

  // if the user owns the community or the channel, or they are the original creator, they can delete the thread
  if (
    currentUserChannelPermissions.isOwner ||
    currentUserChannelPermissions.isModerator ||
    currentUserCommunityPermissions.isOwner ||
    currentUserCommunityPermissions.isModerator ||
    threadToEvaluate.creatorId === user.id
  ) {
    // if the current user doing the deleting does not match the thread creator, we can assume that this deletion is happening as a moderation event. In this case we grant reputation to the moderator
    if (user.id !== threadToEvaluate.creatorId) {
      processReputationEventQueue.add({
        userId: user.id,
        type: 'thread deleted by moderation',
        entityId: threadToEvaluate.communityId,
      });
    }

    return await deleteThread(threadId, user.id);
  }

  // if the user is not a channel or community owner, the thread can't be locked
  return new UserError(
    "You don't have permission to make changes to this thread."
  );
});
