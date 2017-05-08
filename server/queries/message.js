//@flow

/**
 * Message query resolvers
 */
const { getMessage } = require('../models/message');
const { getUser } = require('../models/user');
import { getReactions } from '../models/reaction';
import type { LocationTypes } from '../models/message';

type GetMessageProps = {
  location: LocationTypes,
  id: String,
};

type Root = {
  id: string,
  sender: string,
};

module.exports = {
  Query: {
    message: (_: Root, { location, id }: GetMessageProps) =>
      getMessage(location, id),
  },
  Message: {
    sender: ({ sender }: Root) => getUser({ uid: sender }),
    reactions: ({ id }: Root) => getReactions(id),
  },
};
