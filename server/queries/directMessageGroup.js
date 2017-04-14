//@flow
/**
 * Story query resolvers
 */
const { getDirectMessageGroup } = require('../models/directMessageGroup');
const { getMessagesByLocationAndThread } = require('../models/message');
const { getUser, getUsers } = require('../models/user');
import type { LocationTypes } from '../models/message';

type GetMessageProps = {
  location: LocationTypes,
  id: String,
};

module.exports = {
  Query: {
    directMessageGroup: (_, id: String) => getDirectMessageGroup(id),
  },
  DirectMessageGroup: {
    messages: ({ location, id }: GetMessageProps) =>
      getMessagesByLocationAndThread(location, id),
    users: ({ users }) => getUsers(users),
    creator: ({ creator }) => getUser(creator),
  },
};
