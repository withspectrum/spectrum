// @flow
/*

    DEPRECATED 2/3/2018 by @brian

*/
import type { DBMessage } from 'shared/types';
import type { GraphQLContext } from '../../';

export default async (
  { senderId, threadId, threadType }: DBMessage,
  _: any,
  { loaders }: GraphQLContext
) => {
  // there will be no community to resolve in direct message threads, so we can escape early
  // and only return the sender
  if (threadType === 'directMessageThread') {
    return loaders.user.load(senderId);
  }

  const [thread, sender] = await Promise.all([
    loaders.thread.load(threadId),
    loaders.user.load(senderId),
  ]);

  if (!thread || !sender) return null;

  const permissions = await loaders.userPermissionsInCommunity.load([
    senderId,
    thread.communityId,
  ]);

  return {
    ...sender,
    contextPermission: {
      communityId: thread.communityId,
      reputation: permissions ? permissions.reputation : 0,
      isModerator: permissions ? permissions.isModerator : false,
      isOwner: permissions ? permissions.isOwner : false,
      isBlocked: permissions ? permissions.isBlocked : false,
    },
  };
};
