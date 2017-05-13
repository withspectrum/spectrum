//@flow
// $FlowFixMe
const { UserError } = require('graphql-errors');

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
    addMessage: (_, { location, message }: AddMessageProps, { user }) => {
      // user must be authed to send a message
      if (!user)
        return new UserError('You must be signed in to send a message.');

      // all checks passed
      return storeMessage(location, message, user);
    },
  },
};
