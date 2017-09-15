// @flow
import UserError from '../utils/UserError';
const {
  markAllNotificationsSeen,
  markSingleNotificationSeen,
  markAllNotificationsRead,
  markDirectMessageNotificationsSeen,
} = require('../models/usersNotifications');

module.exports = {
  Mutation: {
    markAllNotificationsSeen: (_, __, { user }) => {
      if (!user)
        return new UserError('You must be logged in to view notifications');
      return markAllNotificationsSeen(user.id);
    },
    markAllNotificationsRead: (_, __, { user }) => {
      if (!user)
        return new UserError('You must be logged in to view notifications');
      return markAllNotificationsRead(user.id);
    },
    markDirectMessageNotificationsSeen: (_, __, { user }) => {
      if (!user)
        return new UserError('You must be logged in to view notifications');
      return markDirectMessageNotificationsSeen(user.id);
    },
    markSingleNotificationSeen: (_, { id }, { user }) => {
      if (!user)
        return new UserError('You must be logged in to view notifications');
      return markSingleNotificationSeen(id, user.id);
    },
    toggleNotificationReadState: (_, { id }, { user }) => {
      if (!user)
        return new UserError('You must be logged in to view notifications');
      return toggleNotificationReadState(id, user.id);
    },
  },
};
