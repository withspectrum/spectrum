//@flow
/**
 * Story query resolvers
 */
const { getDirectMessageGroup } = require('../models/directMessageGroup');
const { getMessagesByLocationAndThread } = require('../models/message');
const { getUser, getUsers } = require('../models/user');
import type { LocationTypes } from '../models/message';

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
    messages: ({ id }: { id: String }) =>
      getMessagesByLocationAndThread('direct_message_groups', id),
    users: ({ users }: { users: Array<DirectMessageUser> }) =>
      getUsers(users.map(user => user.user)).then(dbUsers =>
        dbUsers.map((user, index) => ({
          user,
          lastSeen: users[index].lastSeen,
          lastActivity: users[index].lastActivity,
        }))
      ),
    creator: ({ creator }: { creator: String }) => getUser(creator),
  },
};
