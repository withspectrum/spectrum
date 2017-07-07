// @flow
import { editUser, getUsers } from '../models/user';
import type { EditUserArguments } from '../models/user';
import {
  getUsersSettings,
  updateUsersNotificationSettings,
} from '../models/usersSettings';
import {
  storeSubscription,
  removeSubscription,
} from '../models/web-push-subscription';
// $FlowFixMe
import UserError from '../utils/UserError';
import { sendWebPushNotification } from '../utils/web-push';

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

const subscribeNotification = JSON.stringify({
  title: 'A notification from Spectrum',
  body: 'Yay, notifications are enabled! 🚀',
});

module.exports = {
  Mutation: {
    editUser: (_, args: EditUserArguments, { user }) => {
      const currentUser = user;

      // user must be authed to edit a channel
      if (!currentUser) {
        return new UserError(
          'You must be signed in to make changes to this profile.'
        );
      }

      return editUser(args, currentUser.id);
    },
    toggleNotificationSettings: (
      _,
      { input }: { input: ToggleNotificationsArguments },
      { user }
    ) => {
      const currentUser = user;

      if (!currentUser) {
        return new UserError(
          'You must be signed in to make changes to this profile.'
        );
      }

      return getUsersSettings(currentUser.id)
        .then(settings => {
          let newSettings = Object.assign({}, settings, {
            ...settings,
          });
          let oldVal =
            settings.notifications.types[input.notificationType][
              input.deliveryMethod
            ];
          newSettings['notifications']['types'][input.notificationType][
            input.deliveryMethod
          ] = !oldVal;

          return updateUsersNotificationSettings(currentUser.id, newSettings);
        })
        .then(() => getUsers([currentUser.id]).then(users => users[0]));
    },
    subscribeWebPush: (
      _,
      { subscription }: { subscription: WebPushSubscription },
      { user }
    ) => {
      if (!user || !user.id)
        throw new UserError(
          'Can only subscribe to web push notifications when logged in.'
        );

      return storeSubscription(subscription, user.id)
        .then(() => {
          return sendWebPushNotification(subscription, subscribeNotification, {
            TTL: 300, // If the user doesn't go online for five minutes don't send him this notification anymore
          }).catch(err => {
            console.log('error sending welcome notification');
            console.log(err);
          });
        })
        .then(() => true)
        .catch(err => {
          throw new UserError(`Couldn't store web push subscription.`);
        });
    },
    unsubscribeWebPush: (_, endpoint: string, { user }) => {
      if (!user || !user.id)
        throw new UserError(
          'Can only unsubscribe from web push notifications when logged in.'
        );
      return removeSubscription(endpoint).then(() => true).catch(err => {
        throw new UserError(`Couldn't remove web push subscription.`);
      });
    },
  },
};
