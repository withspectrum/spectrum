// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getMessage,
  deleteMessage,
  userHasMessagesInThread,
} from '../../models/message';
import { getThread } from '../../models/thread';
import { deleteParticipantInThread } from '../../models/usersThreads';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { events } from 'shared/analytics';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import { trackQueue } from 'shared/bull/queues';

export default requireAuth(
  async (_: any, { id }: { id: string }, { user }: GraphQLContext) => {
    const message = await getMessage(id);

    if (!message) {
      trackQueue.add({
        userId: user.id,
        event: events.MESSAGE_DELETED_FAILED,
        properties: {
          reason: 'message not found',
        },
      });

      return new UserError('This message does not exist.');
    }

    if (message.senderId !== user.id) {
      // Only the sender can delete a directMessageThread message
      if (message.threadType === 'directMessageThread') {
        trackQueue.add({
          userId: user.id,
          event: events.DIRECT_MESSAGE_DELETED_FAILED,
          context: { messageId: id },
          properties: {
            reason: 'message not sent by user',
          },
        });

        return new UserError('You can only delete your own messages.');
      }

      const thread = await getThread(message.threadId);

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
          event: events.MESSAGE_DELETED_FAILED,
          context: { messageId: id },
          properties: {
            reason: 'no permission',
          },
        });

        return new UserError(
          "You don't have permission to delete this message."
        );
      }
    }

    // Delete message and remove participant from thread if it's the only message from that person
    return deleteMessage(user.id, id)
      .then(async () => {
        // We don't need to delete participants of direct message threads
        if (message.threadType === 'directMessageThread') return true;

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
      .then(() => true);
  }
);
