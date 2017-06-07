// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
import Dropdown from '../../../components/dropdown';
import { NullState } from '../../../components/upsell';
import { Button, OutlineButton } from '../../../components/buttons';
import { DropdownHeader, DropdownFooter, Notification } from '../style';

const NullNotifications = () => (
  <NullState
    bg="notification"
    heading={`No notifications`}
    copy={`You're all good! 🎉`}
  />
);

const NotificationList = ({ notifications }) => {
  console.log('Component received notifications:', notifications);
  return (
    <div>
      {notifications &&
        notifications.map(notification => {
          return (
            <Notification key={notification.id}>
              <div>
                notification with seen state
                {' '}
                {notification.isSeen ? 'seen' : 'unseen'}
              </div>
              <div>
                notification with read state
                {' '}
                {notification.isRead ? 'read' : 'unread'}
              </div>
            </Notification>
          );
        })}
    </div>
  );
};

const NotificationDropdownPure = ({ notifications, markAllRead }) => {
  return (
    <Dropdown>
      <DropdownHeader>
        My Notifications
      </DropdownHeader>
      {!notifications && <NullNotifications />}
      {notifications && <NotificationList notifications={notifications} />}
      <DropdownFooter>
        <OutlineButton onClick={() => markAllRead()}>
          Mark All Read
        </OutlineButton>
        <Button to={'/notifications'}>View all</Button>
      </DropdownFooter>
    </Dropdown>
  );
};

export const NotificationDropdown = compose(pure)(NotificationDropdownPure);
