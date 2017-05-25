// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import pure from 'recompose/pure';
import { PendingUserNotificationContainer, PendingUserCount } from './style';

const PendingUsersNotificationPure = ({ channel }) => {
  if (!channel.pendingUsers || channel.pendingUsers.length === 0)
    return <span />;
  return (
    <PendingUserNotificationContainer>
      <Link to={`/${channel.community.slug}/${channel.slug}/settings`}>
        <PendingUserCount>{channel.pendingUsers.length}</PendingUserCount>
        Pending members
      </Link>
    </PendingUserNotificationContainer>
  );
};

export const PendingUsersNotification = pure(PendingUsersNotificationPure);

export default PendingUsersNotification;
