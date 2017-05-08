//@flow
/**
 * Story query resolvers
 */
const { getDirectMessageGroup } = require('../models/directMessageGroup');
const { getMessagesByLocationAndThread } = require('../models/message');
const { getUser, getUsers } = require('../models/user');
import type { LocationTypes } from '../models/message';
import type { PaginationOptions } from '../utils/paginate-arrays';
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
      return getMessagesByLocationAndThread('direct_messages', id, {
        first,
        after: cursorId,
      }).then(([messages, lastMessage]) => ({
        pageInfo: {
          hasNextPage: messages.length > 0
            ? lastMessage.id !== messages[messages.length - 1].id
            : lastMessage.id !== cursorId,
        },
        edges: messages.map(message => ({
          cursor: encode(message.id),
          node: message,
        })),
      }));
    },
    users: ({ users }: { users: Array<DirectMessageUser> }) =>
      getUsers(users.map(user => user.user)).then(dbUsers =>
        dbUsers.map((user, index) => ({
          user,
          lastSeen: users[index].lastSeen,
          lastActivity: users[index].lastActivity,
        }))
      ),
    creator: ({ creator }: { creator: String }) => getUser({ uid: creator }),
  },
};
