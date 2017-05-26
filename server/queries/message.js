//@flow
const { getMessage, getMediaMessagesForThread } = require('../models/message');
import { getReactions } from '../models/reaction';
import type { GraphQLContext } from '../';

type GetMessageProps = {
  messageId: string,
};

type Root = {
  messageId: string,
  senderId: string,
};

module.exports = {
  Query: {
    message: (_: Root, { id }: GetMessageProps) => getMessage(id),
    getMediaMessagesForThread: (_, { threadId }) =>
      getMediaMessagesForThread(threadId),
  },
  Message: {
    sender: ({ senderId }: Root, _: any, { loaders }: GraphQLContext) =>
      loaders.user.load(senderId),
    reactions: ({ id }: Root) => getReactions(id),
  },
};
