/**
 * Message mutation resolvers
 */
const {
  markAllUserNotificationsSeen,
  markDirectMessageNotificationsAsSeen,
} = require('../models/usersNotifications');

module.exports = {
  Mutation: {
    markAllUserNotificationsSeen: (_, __, { user }) =>
      markAllUserNotificationsSeen(user.id),
    markDirectMessageNotificationsAsSeen: (_, __, { user }) =>
      markDirectMessageNotificationsAsSeen(user.id),
    toggleNotificationReadState: (_, { id }, { user }) =>
      toggleNotificationReadState(id, user.id),
  },
};
