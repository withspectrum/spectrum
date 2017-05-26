//@flow
// $FlowFixMe
const { UserError } = require('graphql-errors');
const { storeMessage } = require('../models/message');
import type { MessageProps } from '../models/message';
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

      // all checks passed
      if (message.messageType === 'text') {
        // send a normal text message
        return storeMessage(message, currentUser);
      } else if (message.messageType === 'media') {
        // upload the photo, return the photo url, then store the message
        return uploadImage(message.file, 'threads', message.threadId, url => {
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

          return storeMessage(newMessage, currentUser);
        });
      } else {
        return new UserError('Unknown message type on this bad boy.');
      }
    },
  },
};
