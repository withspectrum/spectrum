/**
 * Story query resolvers
 */
const { getDirectMessageGroup } = require('../models/directMessageGroup');
const { getMessagesByLocationAndThread } = require('../models/message');
const { getUser, getUsers } = require('../models/user');

module.exports = {
  Query: {
    directMessageGroup: (_, id) => getDirectMessageGroup(id),
  },
  DirectMessageGroup: {
    messages: ({ location, id }) =>
      getMessagesByLocationAndThread(location, id),
    users: ({ users }) => getUsers(users),
    creator: ({ creator }) => getUser(creator),
  },
};
