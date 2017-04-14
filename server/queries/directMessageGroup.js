//@flow
/**
 * Story query resolvers
 */
const { getDirectMessageGroup } = require('../models/directMessageGroup');
const { getMessagesByLocationAndThread } = require('../models/message');
const { getUser, getUsers } = require('../models/user');
import type { LocationTypes } from '../models/message';

module.exports = {
  Query: {
    directMessageGroup: (_: any, { id }: { id: String }) =>
      getDirectMessageGroup(id),
  },
  DirectMessageGroup: {
    messages: ({ id }: { id: String }) =>
      getMessagesByLocationAndThread('direct_message_groups', id),
    users: ({ users }: { users: Array<String> }) => getUsers(users),
    creator: ({ creator }: { creator: String }) => getUser(creator),
  },
};
