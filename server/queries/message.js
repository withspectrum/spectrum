/**
 * Message query resolvers
 */
const { getMessage } = require('../models/message');
const { getUser } = require('../models/user');

module.exports = {
  Query: {
    message: (_, { id }) => getMessage(id),
  },
  Message: {
    sender: ({ sender }) => getUser(sender),
  },
};
