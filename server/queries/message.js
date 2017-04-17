//@flow

/**
 * Message query resolvers
 */
const { getMessage, getReactions } = require('../models/message');
const { getUser } = require('../models/user');
import type { LocationTypes } from '../models/message';

type GetMessageProps = {
  location: LocationTypes,
  id: String,
};

module.exports = {
  Query: {
    message: (_, { location, id }: GetMessageProps) => getMessage(location, id),
  },
  Message: {
    sender: ({ sender }: Object) => getUser(sender),
  },
};
