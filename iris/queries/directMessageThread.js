//@flow
const { getDirectMessageThread } = require('../models/directMessageThread');
const {
  getMembersInDirectMessageThread,
} = require('../models/usersDirectMessageThreads');
const { getLastMessage, getMessages } = require('../models/message');
import paginate from '../utils/paginate-arrays';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GraphQLContext } from '../';
import { encode, decode } from '../utils/base64';

type DirectMessageUser = {
  userId: any,
  lastSeen: Date,
  lastActivity: Date,
};

module.exports = {
  Query: {
    directMessageThread: (_: any, { id }: { id: String }) =>
      getDirectMessageThread(id),
  },
  DirectMessageThread: {
    messageConnection: (
      { id }: { id: String },
      { first = 50, after }: PaginationOptions
    ) => {
      const cursor = decode(after);
      return getMessages(id, {
        first,
        after: cursor,
      })
        .then(messages =>
          paginate(
            messages,
            { first, after: cursor },
            message => message.id === cursor
          )
        )
        .then(result => ({
          pageInfo: {
            hasNextPage: result.hasMoreItems,
          },
          edges: result.list.map(message => ({
            cursor: encode(message.id),
            node: message,
          })),
        }));
    },
    participants: ({ id }, _, { loaders, user }) => {
      return getMembersInDirectMessageThread(id);
    },
    snippet: ({ id }) => {
      return getLastMessage(id).then(message => {
        if (!message) return 'No messages yet...';
        return message.content.body;
      });
    },
  },
};
