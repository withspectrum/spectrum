/**
 * Message mutation resolvers
 */
const { storeMessage } = require('../models/message');

module.exports = {
  Mutation: {
    addMessage: (_, { location, message }) => storeMessage(location, message),
  },
};
