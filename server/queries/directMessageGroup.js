//@flow
/**
 * Story query resolvers
 */
const { getDirectMessageGroup } = require('../models/directMessageGroup');
const { getMessages } = require('../models/message');
import paginate from '../utils/paginate-arrays';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GraphQLContext } from '../';
import { encode, decode } from '../utils/base64';

type DirectMessageUser = {
  user: any,
  lastSeen: Date,
  lastActivity: Date,
};

module.exports = {
  Query: {
    directMessageGroup: (_: any, { id }: { id: String }) =>
      getDirectMessageGroup(id),
  },
  DirectMessageGroup: {
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
    users: (
      { users }: { users: Array<DirectMessageUser> },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.user.loadMany(users),
    creator: (
      { creator }: { creator: string },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.user.load(creator),
    snippet: ({ id }, _: any, { loader }: GraphQLContext) =>
      getMessages(id).then(messages => {
        // if there are messages in the group
        return messages.length > 0
          ? // return the last message's content as the snippet, or a placeholder
            messages[messages.length - 1].message.content
          : 'No messages yet...';
      }),
  },
};
