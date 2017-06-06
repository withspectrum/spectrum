/**
 * Message mutation resolvers
 */
const {
  markAllUserNotificationsSeen,
} = require('../models/usersNotifications');

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
