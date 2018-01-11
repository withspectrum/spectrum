// @flow
const debug = require('debug')('iris:mutations:message');
import UserError from '../utils/UserError';
import {
  storeMessage,
  getMessage,
  deleteMessage,
  userHasMessagesInThread,
} from '../models/message';
import { setDirectMessageThreadLastActive } from '../models/directMessageThread';
import {
  createParticipantInThread,
  deleteParticipantInThread,
  createParticipantWithoutNotificationsInThread,
} from '../models/usersThreads';
import { setUserLastSeenInDirectMessageThread } from '../models/usersDirectMessageThreads';
import { getThread } from '../models/thread';
import { getUserPermissionsInCommunity } from '../models/usersCommunities';
import { getUserPermissionsInChannel } from '../models/usersChannels';
import { uploadImage } from '../utils/s3';
import type { Message } from '../models/message';
import type { GraphQLContext } from '../';

type MessageInput = {
  threadId: string,
  threadType: 'story' | 'directMessageThread',
  messageType: 'text' | 'media' | 'draftjs',
  content: {
    body: string,
  },
  file?: File,
};

type DeleteMessageInput = {
  id: string,
};

module.exports = {
  Mutation: {
    addMessage: async (
      _: any,
      { message }: { message: MessageInput },
      { user, loaders }: GraphQLContext
    ) => {
      const currentUser = user;
      // user must be authed to send a message
      if (!currentUser)
        throw new UserError('You must be signed in to send a message.');
      if (message.messageType === 'media' && !message.file)
        throw new UserError(
          `Can't send media message without an image, please try again.`
        );
      if (message.messageType !== 'media' && message.file)
        throw new UserError(
          `To send an image, please use messageType: "media" instead of "${message.messageType}".`
        );

      const thread = await loaders.thread.load(message.threadId);

      let contextPermissions;
      // Make sure that we have permission to send a message in the community
      if (message.threadType === 'story') {
        const permissions = await loaders.userPermissionsInCommunity.load([
          currentUser.id,
          thread.communityId,
        ]);

        if (
          permissions.isBlocked ||
          (!permissions.isMember &&
            !permissions.isModerator &&
            !permissions.isOwner)
        ) {
          throw new UserError(`You're not allowed to post in this community.`);
        }

        contextPermissions = {
          communityId: thread.communityId,
          reputation: permissions ? permissions.reputation : 0,
          isModerator: permissions ? permissions.isModerator : false,
          isOwner: permissions ? permissions.isOwner : false,
        };
      }

      // if the message was a dm thread, set the last seen and last active times
      if (message.threadType === 'directMessageThread') {
        setDirectMessageThreadLastActive(message.threadId);
        setUserLastSeenInDirectMessageThread(message.threadId, currentUser.id);
      }

      // if the message was sent in a story thread, create a new participant
      // relationship to the thread - this will enable us to query against
      // thread.participants as well as have per-thread notifications for a user
      if (message.threadType === 'story' && (thread && !thread.watercooler)) {
        createParticipantInThread(message.threadId, currentUser.id);
      }

      if (thread && thread.watercooler) {
        createParticipantWithoutNotificationsInThread(
          message.threadId,
          currentUser.id
        );
      }

      let messageForDb = Object.assign({}, message);
      if (message.file && message.messageType === 'media') {
        const fileMetaData = {
          name: message.file.name,
          size: message.file.size,
          type: message.file.type,
        };
        const url = await uploadImage(
          message.file,
          'threads',
          message.threadId
        );
        messageForDb = Object.assign({}, messageForDb, {
          content: {
            body: url,
          },
          file: fileMetaData,
        });
      }

      const dbMessage = await storeMessage(messageForDb, currentUser.id);

      if (dbMessage.threadType === 'directMessageThread') return dbMessage;

      return {
        ...dbMessage,
        contextPermissions,
      };
    },
    deleteMessage: async (
      _: any,
      { id }: DeleteMessageInput,
      { user }: GraphQLContext
    ) => {
      debug(`delete message#${id}`);
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

        const thread = await getThread(message.threadId);
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
          throw new UserError(
            "You don't have permission to delete this message."
          );
      }

      // Delete message and remove participant from thread if it's the only message from that person
      debug(`permission checks pass, actually delete message#${id}`);
      return deleteMessage(currentUser.id, id).then(() => {
        // We don't need to delete participants of direct message threads
        if (message.threadType === 'directMessageThread') return true;

        debug('thread message, check if user has more messages in thread');
        return userHasMessagesInThread(
          message.threadId,
          message.senderId
        ).then(hasMoreMessages => {
          if (hasMoreMessages) return true;
          debug('user has no more messages, delete userThread record');
          return deleteParticipantInThread(
            message.threadId,
            message.senderId
          ).then(() => true);
        });
      });
    },
  },
};
