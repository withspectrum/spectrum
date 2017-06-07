// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
import Dropdown from '../../../components/dropdown';
import { NullState } from '../../../components/upsell';
import { Button } from '../../../components/buttons';
import { DropdownHeader, DropdownFooter } from '../style';

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
      👍 cool. there's notifications here. maybe just, like, actually do the code for it.
    </div>
  );
};

const NotificationDropdownPure = ({ notifications }) => {
  return (
    <Dropdown>
      <DropdownHeader>
        My Notifications
      </DropdownHeader>
      {!notifications && <NullNotifications />}
      {notifications && <NotificationList notifications={notifications} />}
      <DropdownFooter>
        <Button to={'/notifications'}>View all</Button>
      </DropdownFooter>
    </Dropdown>
  );
};

export const NotificationDropdown = compose(pure)(NotificationDropdownPure);
