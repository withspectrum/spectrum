/**
 * Message query resolvers
 */
const { getMessage } = require('../models/message');

module.exports = {
  Query: {
    message: (_, { id }) => getMessage(id),
  },
};
