// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { displayLoadingCard } from '../../../components/loading';
import { getPendingChannelUsers } from '../queries';
import { PendingUserNotificationContainer, PendingUserCount } from './style';

const PendingUsersNotificationPure = ({ data: { channel } }) => {
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

export const PendingUsersNotification = compose(
  getPendingChannelUsers,
  displayLoadingCard,
  pure
)(PendingUsersNotificationPure);

export default PendingUsersNotification;
