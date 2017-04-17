//@flow

/**
 * Message mutation resolvers
 */
const { storeMessage, toggleReaction } = require('../models/message');
import type { LocationTypes, MessageProps } from '../models/message';

type AddMessageProps = {
  location: LocationTypes,
  message: MessageProps,
};

type ToggleReactionProps = {
  location: LocationTypes,
  reaction: {
    user: String,
    message: String,
    type: String,
  },
};

module.exports = {
  Mutation: {
    addMessage: (_, { location, message }: AddMessageProps) =>
      storeMessage(location, message),
    toggleReaction: (_, { location, reaction }: ToggleReactionProps) =>
      toggleReaction(location, reaction),
  },
};
