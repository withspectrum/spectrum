// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import Link from 'src/components/link';
import Icon from '../../../components/icons';
import Dropdown from '../../../components/dropdown';
import { Loading } from '../../../components/loading';
import { NullState } from '../../../components/upsell';
import { TextButton } from '../../../components/buttons';
import { DropdownHeader, DropdownFooter, MarkAllSeen } from '../style';
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
    currentUser,
    history,
    error,
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
        <TextButton
          color={count > 0 ? 'brand.alt' : 'text.alt'}
          onClick={markAllAsSeen}
        >
          Mark all as seen
        </TextButton>
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
            <TextButton
              color={'text.alt'}
              onClick={() => history.push('/notifications')}
            >
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
