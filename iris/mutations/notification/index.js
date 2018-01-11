// @flow
import markAllNotificationsSeen from './markAllNotificationsSeen';
import markAllNotificationsRead from './markAllNotificationsRead';
import markSingleNotificationSeen from './markSingleNotificationSeen';
import markDirectMessageNotificationsSeen from './markDirectMessageNotificationsSeen';

module.exports = {
  Mutation: {
    markAllNotificationsSeen,
    markAllNotificationsRead,
    markDirectMessageNotificationsSeen,
    markSingleNotificationSeen,
  },
};
