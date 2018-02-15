// @flow
const {
  listenToNewNotifications,
  listenToNewDirectMessageNotifications,
} = require('../models/notification');
import { sendPushNotificationsQueue } from 'shared/bull/queues';

const sendDeduplicatedPushNotification = notification => {
  // By using notification.id and notification.userId here we make sure that even when multiple instances of athena are running
  // and are adding this job to the queue it gets deduplicated
  sendPushNotificationsQueue.add(
    { notification },
    { jobId: `notification-${notification.id}-${notification.userId}` }
  );
};

export default () => {
  listenToNewNotifications(sendDeduplicatedPushNotification);
  listenToNewDirectMessageNotifications(sendDeduplicatedPushNotification);
};
