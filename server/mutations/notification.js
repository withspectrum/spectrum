/**
 * Message mutation resolvers
 */
const { markNotificationsRead } = require('../models/notification');

module.exports = {
  Mutation: {
    markAllUserNotificationsSeen: (_, __, { user }) =>
      markAllUserNotificationsSeen(user.id),
    markAllUserDirectMessageNotificationsRead: (_, __, { user }) =>
      markAllUserDirectMessageNotificationsRead(user.id),
    toggleNotificationReadState: (_, { id }, { user }) =>
      toggleNotificationReadState(id, user.id),
  },
};
