// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getMessage,
  deleteMessage,
  userHasMessagesInThread,
  getMessages,
} from '../../models/message';
import { getThread, setThreadLastActive } from '../../models/thread';
import { deleteParticipantInThread } from '../../models/usersThreads';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';

export default async (
  _: any,
  { id }: { id: string },
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;
  if (!currentUser)
    throw new UserError('You must be signed in to delete a message.');

  const message = await getMessage(id);
  if (!message) throw new UserError('This message does not exist.');

  if (message.senderId !== currentUser.id) {
    // Only the sender can delete a directMessageThread message
    if (message.threadType === 'directMessageThread') {
      throw new UserError('You can only delete your own messages.');
    }

    const thread = await loaders.thread.load(message.threadId);
    const communityPermissions = await getUserPermissionsInCommunity(
      thread.communityId,
      currentUser.id
    );
    const channelPermissions = await getUserPermissionsInChannel(
      thread.channelId,
      currentUser.id
    );
    const canModerate =
      channelPermissions.isOwner ||
      communityPermissions.isOwner ||
      channelPermissions.isModerator ||
      communityPermissions.isModerator;
    if (!canModerate)
      throw new UserError("You don't have permission to delete this message.");
  }

  // Delete message and remove participant from thread if it's the only message from that person
  return deleteMessage(currentUser.id, id)
    .then(async () => {
      // We don't need to delete participants of direct message threads
      if (message.threadType === 'directMessageThread') return true;

      const thread = await loaders.thread.load(message.threadId);
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
    .then(() => true);
};
