//@flow

/**
 * Message mutation resolvers
 */
const { storeMessage } = require('../models/message');
import type { LocationTypes, MessageProps } from '../models/message';

type AddMessageProps = {
  location: LocationTypes,
  message: MessageProps,
};
module.exports = {
  Mutation: {
    addMessage: (_, { location, message }: AddMessageProps) =>
      storeMessage(location, message),
  },
};
