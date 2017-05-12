//@flow

/**
 * Message mutation resolvers
 */
const { storeMessage } = require('../models/message');
import type { MessageProps } from '../models/message';

type AddMessageProps = {
  message: MessageProps,
};
module.exports = {
  Mutation: {
    addMessage: (_, { message }: AddMessageProps, { user }) =>
      storeMessage(message, user),
  },
};
