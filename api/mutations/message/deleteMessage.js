// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getMessage,
  deleteMessage,
  userHasMessagesInThread,
  getMessages,
} from '../../models/message';
import { setThreadLastActive } from '../../models/thread';
import { deleteParticipantInThread } from '../../models/usersThreads';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import { calculateThreadScoreQueue } from 'shared/bull/queues';

type Input = {
  id: string,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { id } = args;
  const { user, loaders } = ctx;

  const message = await getMessage(id);

  if (!message) {
    return new UserError('This message does not exist.');
  }

  const thread = await loaders.thread.load(message.threadId);

  if (message.senderId !== user.id) {
    // Only the sender can delete a directMessageThread message
    if (message.threadType === 'directMessageThread') {
      return new UserError('You can only delete your own messages.');
    }

    const [communityPermissions, channelPermissions] = await Promise.all([
      getUserPermissionsInCommunity(thread.communityId, user.id),
      getUserPermissionsInChannel(thread.channelId, user.id),
    ]);

    const canModerate =
      channelPermissions.isOwner ||
      communityPermissions.isOwner ||
      channelPermissions.isModerator ||
      communityPermissions.isModerator;
    if (!canModerate) {
      return new UserError("You don't have permission to delete this message.");
    }
  }

  // Delete message and remove participant from thread if it's the only message from that person
  return deleteMessage(user.id, id)
    .then(async () => {
      // We don't need to delete participants of direct message threads
      if (message.threadType === 'directMessageThread') return true;

      // If it was the last message in the thread, reset thread.lastActive to
      // the previous messages timestamp
      if (
        new Date(thread.lastActive).getTime() ===
        new Date(message.timestamp).getTime()
      ) {
        const messages = await getMessages(message.threadId, { last: 1 });
        await setThreadLastActive(
          message.threadId,
          messages && messages.length > 0
            ? messages[0].timestamp
            : thread.createdAt
        );
      }

      const hasMoreMessages = await userHasMessagesInThread(
        message.threadId,
        message.senderId
      );

      if (hasMoreMessages) return;

      return await deleteParticipantInThread(
        message.threadId,
        message.senderId
      );
    })
    .then(() => {
      return calculateThreadScoreQueue.add(
        {
          threadId: message.threadId,
        },
        {
          jobId: message.threadId,
        }
      );
    })
    .then(() => true);
});
