// @flow
export type WebPushSubscription = {
  keys: {
    p256dh: string,
    auth: string,
  },
  endpoint: string,
};

import editUser from './editUser';
import toggleNotificationSettings from './toggleNotificationSettings';
import subscribeWebPush from './subscribeWebPush';
import unsubscribeWebPush from './unsubscribeWebPush';
import updateUserEmail from './updateUserEmail';
import deleteCurrentUser from './deleteCurrentUser';
import subscribeExpoPush from './subscribeExpoPush';

module.exports = {
  Mutation: {
    editUser,
    toggleNotificationSettings,
    subscribeWebPush,
    unsubscribeWebPush,
    updateUserEmail,
    deleteCurrentUser,
    subscribeExpoPush,
  },
};
