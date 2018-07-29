// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getMessage,
  editMessage,
  userHasMessagesInThread,
  getMessages,
} from '../../models/message';
import { setThreadLastActive } from '../../models/thread';
import { deleteParticipantInThread } from '../../models/usersThreads';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { events } from 'shared/analytics';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import { trackQueue } from 'shared/bull/queues';

type Input = {
  id: string,
  message: {
    messageType: 'text' | 'media' | 'draftjs',
    content: {
      body: string,
    },
    file?: FileUpload,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { id, inputMessage } = args;
  const { user, loaders } = ctx;

  const message = await getMessage(id);

  if (!message) {
    trackQueue.add({
      userId: user.id,
      event: events.MESSAGE_EDITED_FAILED,
      properties: {
        reason: 'message not found',
      },
    });

    return new UserError('This message does not exist.');
  }

  const eventFailed =
    message.threadType === 'story'
      ? events.MESSAGE_EDITED_FAILED
      : events.DIRECT_MESSAGE_EDITED_FAILED;

  const thread = await loaders.thread.load(message.threadId);

  if (message.senderId !== user.id) {
    // Only the sender can edit a directMessageThread message
    if (message.threadType === 'directMessageThread') {
      trackQueue.add({
        userId: user.id,
        event: eventFailed,
        context: { messageId: id },
        properties: {
          reason: 'message not sent by user',
        },
      });

      return new UserError('You can only edit your own messages.');
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
      trackQueue.add({
        userId: user.id,
        event: eventFailed,
        context: { messageId: id },
        properties: {
          reason: 'no permission',
        },
      });

      return new UserError("You don't have permission to edit this message.");
    }
  }

  // Delete message and remove participant from thread if it's the only message from that person
  return editMessage(inputMessage, user.id, id)
    .then(async () => {
      // We don't need to delete participants of direct message threads
      if (message.threadType === 'directMessageThread') return true;

      const hasMoreMessages = await userHasMessagesInThread(
        message.threadId,
        message.senderId
      );

      if (hasMoreMessages) return;
    })
    .then(() => true);
});
