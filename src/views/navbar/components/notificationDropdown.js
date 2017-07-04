// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import { Link } from 'react-router-dom';
import Icon from '../../../components/icons';
import Dropdown from '../../../components/dropdown';
import { NullState } from '../../../components/upsell';
import { TextButton } from '../../../components/buttons';
import { DropdownHeader, DropdownFooter } from '../style';
import {
  NotificationDropdownList,
} from '../../../views/notifications/components/notificationDropdownList';

const NullNotifications = () => (
  <NullState
    bg="notification"
    heading={`No notifications`}
    copy={`You're all good! 🎉`}
  />
);

const NotificationDropdownPure = ({
  rawNotifications,
  markAllRead,
  currentUser,
  history,
}) => {
  console.log(currentUser);
  return (
    <Dropdown style={{ width: '400px' }}>
      <DropdownHeader>
        My Notifications
        <Link to={`/users/${currentUser.username}/settings`}>
          <Icon glyph="settings" />
        </Link>
      </DropdownHeader>
      {!rawNotifications ||
        (rawNotifications.length === 0 && <NullNotifications />)}
      {rawNotifications &&
        <NotificationDropdownList
          rawNotifications={rawNotifications}
          currentUser={currentUser}
          history={history}
        />}

      {rawNotifications &&
        rawNotifications.length > 0 &&
        <DropdownFooter>
          <TextButton
            color={'brand.default'}
            onClick={() => history.push('/notifications')}
          >
            View all
          </TextButton>
        </DropdownFooter>}

    </Dropdown>
  );
};

export const NotificationDropdown = compose(withRouter, pure)(
  NotificationDropdownPure
);
