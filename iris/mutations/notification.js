// @flow
const {
  markAllNotificationsSeen,
  markSingleNotificationSeen,
  markAllNotificationsRead,
  markDirectMessageNotificationsSeen,
} = require('../models/usersNotifications');

module.exports = {
  Mutation: {
    markAllNotificationsSeen: (_, __, { user }) =>
      markAllNotificationsSeen(user.id),
    markAllNotificationsRead: (_, __, { user }) =>
      markAllNotificationsRead(user.id),
    markDirectMessageNotificationsSeen: (_, __, { user }) =>
      markDirectMessageNotificationsSeen(user.id),
    markSingleNotificationSeen: (_, { id }, { user }) =>
      markSingleNotificationSeen(id, user.id),
    toggleNotificationReadState: (_, { id }, { user }) =>
      toggleNotificationReadState(id, user.id),
  },
};
