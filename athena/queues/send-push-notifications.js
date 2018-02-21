// @flow
const debug = require('debug')('athena:queue:send-push-notifications');
import sendPushNotifications from '../utils/push-notifications';
import type { Job, PushNotificationsJobData } from 'shared/bull/types';

export default async (job: Job<PushNotificationsJobData>) => {
  const { data: { notification } } = job;
  return sendPushNotifications(notification);
};
