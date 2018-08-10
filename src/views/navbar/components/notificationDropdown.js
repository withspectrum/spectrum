// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import Link from 'src/components/link';
import Icon from 'src/components/icon';
import Dropdown from 'src/components/dropdown';
import { Loading } from 'src/components/loading';
import { NullState } from 'src/components/upsell';
import { Button, PrimaryTextButton, TextButton } from 'src/components/button';
import { NotificationDropdownList } from 'src/views/notifications/components/notificationDropdownList';
import { DropdownHeader, DropdownFooter } from '../style';

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
    currentUser,
    history,
    loading,
    markSingleNotificationAsSeenInState,
  } = props;

  if (rawNotifications && rawNotifications.length > 0) {
    return (
      <NotificationDropdownList
        rawNotifications={rawNotifications}
        currentUser={currentUser}
        history={history}
        markSingleNotificationAsSeenInState={
          markSingleNotificationAsSeenInState
        }
      />
    );
  }

  if (loading) {
    return (
      <div style={{ margin: '32px 0' }}>
        <Loading />
      </div>
    );
  }

  return <NullNotifications />;
};

const NotificationDropdownPure = props => {
  const {
    rawNotifications,
    currentUser,
    history,
    markAllAsSeen,
    count,
    markSingleNotificationAsSeenInState,
    loading,
  } = props;

  return (
    <Dropdown style={{ width: '400px' }}>
      <DropdownHeader>
        <Link to={`/users/${currentUser.username}/settings`}>
          <Icon glyph="settings" />
        </Link>

        {count > 0 ? (
          <PrimaryTextButton onClick={markAllAsSeen}>
            Mark all as seen
          </PrimaryTextButton>
        ) : (
          <Button>Mark all as seen</Button>
        )}
      </DropdownHeader>

      <NotificationContainer
        {...props}
        loading={loading}
        markSingleNotificationAsSeenInState={
          markSingleNotificationAsSeenInState
        }
      />

      {rawNotifications &&
        rawNotifications.length > 0 && (
          <DropdownFooter>
            <TextButton onClick={() => history.push('/notifications')}>
              View all
            </TextButton>
          </DropdownFooter>
        )}
    </Dropdown>
  );
};

export const NotificationDropdown = compose(withRouter)(
  NotificationDropdownPure
);
