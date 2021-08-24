// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
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
    return await deleteThread(threadId, user.id);
  }

  // if the user is not a channel or community owner, the thread can't be locked
  return new UserError(
    "You don't have permission to make changes to this thread."
  );
});
