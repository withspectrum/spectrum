// @flow
import UserError from '../utils/UserError';
const {
  markAllNotificationsSeen,
  markSingleNotificationSeen,
  markAllNotificationsRead,
  markDirectMessageNotificationsSeen,
} = require('../models/usersNotifications');

import markAllNotificationsSeen from './markAllNotificationsSeen';
import markAllNotificationsRead from './markAllNotificationsRead';
import markSingleNotificationSeen from './markSingleNotificationSeen';
import markDirectMessageNotificationsSeen from './markDirectMessageNotificationsSeen';
import toggleNotificationReadState from './toggleNotificationReadState';

module.exports = {
  Mutation: {
    markAllNotificationsSeen,
    markAllNotificationsRead,
    markDirectMessageNotificationsSeen,
    markSingleNotificationSeen,
    toggleNotificationReadState,
  },
};
