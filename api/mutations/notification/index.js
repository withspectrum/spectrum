// @flow
import markAllNotificationsSeen from './markAllNotificationsSeen';
import markSingleNotificationSeen from './markSingleNotificationSeen';
import markDirectMessageNotificationsSeen from './markDirectMessageNotificationsSeen';

module.exports = {
  Mutation: {
    markAllNotificationsSeen,
    markDirectMessageNotificationsSeen,
    markSingleNotificationSeen,
  },
};
