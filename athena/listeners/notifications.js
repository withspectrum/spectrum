// @flow
import {
  listenToNewNotifications,
  listenToNewDirectMessageNotifications,
} from '../models/notification';
import { newChannelCreated } from '../models/channel';
import { iris } from 'shared/bull/queues';

const sendDeduplicatedPushNotification = notification => {
  // By using notification.id and notification.userId here we make sure that even when multiple instances of athena are running
  // and are adding this job to the queue it gets deduplicated
  iris.sendNotificationAsPushQueue.add(
    { notification },
    {
      jobId: `notification-${notification.id}-${notification.userId}-${
        notification.modifiedAt
      }`,
    }
  );
};

export default () => {
  listenToNewNotifications(sendDeduplicatedPushNotification);
  listenToNewDirectMessageNotifications(sendDeduplicatedPushNotification);
  newChannelCreated();
};
