// @flow
import Raven from 'raven';
import UserError from '../utils/UserError';
import { storeMessage, getMessage, deleteMessage } from '../models/message';
import { setDirectMessageThreadLastActive } from '../models/directMessageThread';
import { createParticipantInThread } from '../models/usersThreads';
import { setUserLastSeenInDirectMessageThread } from '../models/usersDirectMessageThreads';
import { getThread } from '../models/thread';
import { getDirectMessageThread } from '../models/directMessageThread';
import { getUserPermissionsInCommunity } from '../models/usersCommunities';
import { uploadImage } from '../utils/s3';
import type { Message } from '../models/message';
import type { GraphQLContext } from '../';

type AddMessageProps = {
  message: Message,
};

type DeleteMessageInput = {
  id: string,
};

module.exports = {
  Mutation: {
    addMessage: (
      _: any,
      { message }: AddMessageProps,
      { user }: GraphQLContext
    ) => {
      const currentUser = user;
      // user must be authed to send a message
      if (!currentUser) {
        return new UserError('You must be signed in to send a message.');
      }

      // if the message was a dm thread, set the last seen and last active times
      if (message.threadType === 'directMessageThread') {
        setDirectMessageThreadLastActive(message.threadId);
        setUserLastSeenInDirectMessageThread(message.threadId, currentUser.id);
      }

      // if the message was sent in a story thread, create a new participant
      // relationship to the thread - this will enable us to query against
      // thread.participants as well as have per-thread notifications for a user
      if (message.threadType === 'story') {
        createParticipantInThread(message.threadId, currentUser.id);
      }

      // all checks passed
      if (message.messageType === 'text') {
        // send a normal text message
        return storeMessage(message, currentUser.id);
      } else if (message.messageType === 'media') {
        // upload the photo, return the photo url, then store the message

        return uploadImage(message.file, 'threads', message.threadId)
          .then(url => {
            // build a new message object with a new file field with metadata
            const newMessage = Object.assign({}, message, {
              content: {
                body: url,
              },
              file: {
                name: message.file.name,
                size: message.file.size,
                type: message.file.type,
              },
            });
            return newMessage;
          })
          .then(newMessage => storeMessage(newMessage, currentUser.id));
      } else {
        return new UserError('Unknown message type on this bad boy.');
      }
    },
    deleteMessage: async (
      _: any,
      { id }: DeleteMessageInput,
      { user }: GraphQLContext
    ) => {
      const currentUser = user;
      if (!currentUser)
        throw new UserError('You must be signed in to delete a message.');

      const message = await getMessage(id);
      if (!message) throw new UserError('This message does not exist.');

      const deleteTheMessage = () =>
        deleteMessage(id)
          .then(() => true)
          .catch(err => {
            console.log(err);
            if (process.env.NODE_ENV === 'production')
              Raven.captureException(err);
            throw new UserError('Oops, something went wrong! Maybe try again?');
          });

      if (message.senderId === currentUser.id) return deleteTheMessage();

      // Only the sender can delete a directMessageThread message
      if (message.threadType === 'directMessageThread')
        throw new UserError('You can only delete your own messages.');

      const thread = await getThread(message.threadId);
      const { isModerator, isOwner } = await getUserPermissionsInCommunity(
        thread.communityId,
        currentUser.id
      );
      if (!isModerator && !isOwner)
        throw new UserError(
          'You have to be a moderator in the community to delete a message.'
        );

      return deleteTheMessage();
    },
  },
};
