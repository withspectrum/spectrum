// @flow
import { isDesktopApp } from './helpers/desktop-app-utils';
import { getItemFromStorage } from './helpers/localStorage';
import { client } from 'shared/graphql';
import {
  subscribeToNewNotifications,
  subscribeToDirectMessageNotifications,
} from 'shared/graphql/subscriptions';
import formatNotification from 'shared/notification-to-text';

// On Electron listen to new notifications outside the component tree
// and show desktop push notifications
export const subscribeToDesktopPush = (
  onClick: ({ href?: string }) => void
) => {
  if (isDesktopApp()) {
    const pushNotification = notification => {
      // Don't send push notifications if the app is focused, duh
      if (window.interop.isFocused()) {
        return;
      }
      const data = getItemFromStorage('spectrum');
      const { title, body, data: notificationData } = formatNotification(
        notification,
        data && data.currentUser.id,
        { isDesktop: true }
      );
      // $FlowIssue Flow doesn't understand the HTML5 Notifications API ref facebook/flow#3784
      const push = new Notification(title, {
        body,
        icon: '/public/img/homescreen-icon-512x512.png',
        tag: notification.id,
        renotify: true,
      });
      push.onclick = () => onClick(notificationData);
    };

    client
      .subscribe({ query: subscribeToDirectMessageNotifications })
      .subscribe({
        next({ data }) {
          if (!data || !data.dmNotificationAdded) return;
          pushNotification(data.dmNotificationAdded);
        },
      });

    client.subscribe({ query: subscribeToNewNotifications }).subscribe({
      next({ data }) {
        if (!data || !data.notificationAdded) return;
        pushNotification(data.notificationAdded);
      },
    });
  }
};
