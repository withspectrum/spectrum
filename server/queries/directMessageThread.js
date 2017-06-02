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
      { first = 100, after }: PaginationOptions
    ) => {
      const cursor = decode(after);
      return getMessages(id, {
        first,
        after: cursor,
      }).then(messages => {
        // Don't paginate messages for now...
        return {
          pageInfo: {
            hasNextPage: false,
          },
          edges: messages.map(message => ({
            node: {
              ...message,
            },
          })),
        };
      });
    },
    participants: ({ id }, _, { loaders }) => {
      return getMembersInDirectMessageThread(id).then(users => users);
    },
    snippet: ({ id }) => {
      return getLastMessage(id).then(message => {
        if (message) {
          return message.content.body;
        } else {
          return 'No messages yet...';
        }
      });
    },
  },
};
