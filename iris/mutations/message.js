// $FlowFixMe
import UserError from '../utils/UserError';
const { storeMessage } = require('../models/message');
import type { MessageProps } from '../models/message';
import { setDirectMessageThreadLastActive } from '../models/directMessageThread';
import { createParticipantInThread } from '../models/usersThreads';
import { setUserLastSeenInDirectMessageThread } from '../models/usersDirectMessageThreads';
import { uploadImage } from '../utils/s3';

type AddMessageProps = {
  message: MessageProps,
};
module.exports = {
  Mutation: {
    addMessage: (_, { message }: AddMessageProps, { user }) => {
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
      if (message.messageType === 'text' || message.messageType === 'draftjs') {
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
  },
};
