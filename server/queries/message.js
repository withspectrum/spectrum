/**
 * Message query resolvers
 */
const { getMessage } = require('../models/message');
const { getUser } = require('../models/user');

module.exports = {
  Query: {
    message: (_, { location, id }) => getMessage(location, id),
  },
  Message: {
    sender: ({ sender }) => getUser(sender),
  },
};
