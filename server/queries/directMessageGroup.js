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
      { first = 10, after }: PaginationOptions
    ) => {
      const cursorId = decode(after);
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
    users: (
      { users }: { users: Array<DirectMessageUser> },
      _: any,
      { loaders }: GraphQLContext
    ) =>
      loaders.user.loadMany(users.map(user => user.user)).then(dbUsers =>
        dbUsers.map((user, index) => ({
          user,
          lastSeen: users[index].lastSeen,
          lastActivity: users[index].lastActivity,
        }))
      ),
    creator: (
      { creator }: { creator: string },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.user.load(creator),
  },
};
