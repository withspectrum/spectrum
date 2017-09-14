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
import { Loading } from '../../../components/loading';
import { NullState } from '../../../components/upsell';
import { TextButton } from '../../../components/buttons';
import { DropdownHeader, DropdownFooter } from '../style';
import { NotificationDropdownList } from '../../../views/notifications/components/notificationDropdownList';

const NullNotifications = () => (
  <NullState
    bg="notification"
    heading={`No notifications`}
    copy={`You're all good! 🎉`}
  />
);

const NotificationContainer = props => {
  const {
    rawNotifications,
    markAllRead,
    currentUser,
    history,
    error,
    loading,
  } = props;

  const noNotifications = !rawNotifications || rawNotifications.length === 0;

  if (loading) {
    return (
      <div style={{ margin: '32px 0' }}>
        <Loading />
      </div>
    );
  } else if (noNotifications || error) {
    return <NullNotifications />;
  } else {
    return (
      <NotificationDropdownList
        rawNotifications={rawNotifications}
        currentUser={currentUser}
        history={history}
      />
    );
  }
};

const NotificationDropdownPure = props => {
  const {
    rawNotifications,
    markAllRead,
    currentUser,
    history,
    error,
    loading,
  } = props;

  console.log('props', props);
  return (
    <Dropdown style={{ width: '400px' }}>
      <DropdownHeader>
        My Notifications
        <Link to={`/users/${currentUser.username}/settings`}>
          <Icon glyph="settings" />
        </Link>
      </DropdownHeader>

      <NotificationContainer {...props} />

      {rawNotifications &&
      rawNotifications.length > 0 && (
        <DropdownFooter>
          <TextButton
            color={'brand.default'}
            onClick={() => history.push('/notifications')}
          >
            View all
          </TextButton>
        </DropdownFooter>
      )}
    </Dropdown>
  );
};

export const NotificationDropdown = compose(withRouter, pure)(
  NotificationDropdownPure
);
