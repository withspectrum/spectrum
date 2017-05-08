//@flow

/**
 * Message query resolvers
 */
const { getMessage } = require('../models/message');
import { getReactions } from '../models/reaction';
import type { LocationTypes } from '../models/message';
import type { GraphQLContext } from '../';

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
    sender: ({ sender }: Root, _: any, { loaders }: GraphQLContext) =>
      loaders.user.load(sender),
    reactions: ({ id }: Root) => getReactions(id),
  },
};
