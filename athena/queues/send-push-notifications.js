// @flow
const debug = require('debug')('athena:queue:send-push-notifications');
import sendPushNotifications from '../utils/push-notifications';
import Raven from '../../shared/raven';
import type { Job, PushNotificationsJobData } from 'shared/bull/types';

export default async (job: Job<PushNotificationsJobData>) => {
  const {
    data: { notification },
  } = job;

  try {
    return sendPushNotifications(notification);
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  }
};
