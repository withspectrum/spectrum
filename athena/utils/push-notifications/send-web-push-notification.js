// @flow
const debug = require('debug')('athena:utils:web-push');
import sendWebPush from 'shared/send-web-push-notification';
import { removeSubscription } from '../../models/web-push-subscription';

export const sendWebPushNotification = (
  subscription: any,
  payload: Object | string,
  options?: ?Object
): Promise<?Object> => {
  return sendWebPush(subscription, payload, options).catch(err => {
    if (err.statusCode === 410 && err.endpoint) {
      debug(`old subscription found (${err.endpoint}), removing`, err);
      return removeSubscription(err.endpoint);
    }
  });
};
