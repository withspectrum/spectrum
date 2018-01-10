// @flow
import {
  editUser,
  getUsers,
  getUser,
  getUserByEmail,
  setUserPendingEmail,
  updateUserEmail,
} from '../models/user';
import type { EditUserArguments, DBUser } from '../models/user';
import {
  getUsersSettings,
  updateUsersNotificationSettings,
} from '../models/usersSettings';
import {
  storeSubscription,
  removeSubscription,
} from '../models/web-push-subscription';
import UserError from '../utils/UserError';
import { sendWebPushNotification } from '../utils/web-push';
import { addQueue } from '../utils/workerQueue';

type ToggleNotificationsArguments = {
  deliveryMethod: string,
  notificationType: string,
};

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

module.exports = {
  Mutation: {
    editUser,
    toggleNotificationSettings,
    subscribeWebPush,
    unsubscribeWebPush,
    updateUserEmail,
  },
};
