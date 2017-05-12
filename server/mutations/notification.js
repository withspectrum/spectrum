/**
 * Message mutation resolvers
 */
const { markNotificationsRead } = require('../models/notification');

module.exports = {
  Mutation: {
    markNotificationsRead: (_, { storyId }) => markNotificationsRead(storyId),
  },
};
