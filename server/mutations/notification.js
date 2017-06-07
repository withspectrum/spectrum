// @flow
const {
  markAllNotificationsSeen,
  markAllNotificationsRead,
  markDirectMessageNotificationsSeen,
} = require('../models/usersNotifications');

module.exports = {
  Mutation: {
    markAllNotificationsSeen: (_, __, { user }) =>
      markAllNotificationsSeen(user.id),
    markAllNotificationsRead: (_, __, { user }) =>
      markAllNotificationsRead(user.id).then(
        data => console.log('data', data) || data
      ),
    markDirectMessageNotificationsSeen: (_, __, { user }) =>
      markDirectMessageNotificationsSeen(user.id),
    toggleNotificationReadState: (_, { id }, { user }) =>
      toggleNotificationReadState(id, user.id),
  },
};
