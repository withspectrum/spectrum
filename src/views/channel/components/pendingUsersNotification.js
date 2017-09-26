// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
import { displayLoadingCard } from '../../../components/loading';
import { getPendingUsersQuery } from '../../../api/channel';
import { PendingUserNotificationContainer, PendingUserCount } from './style';

const PendingUsersNotificationPure = ({ data: { channel } }) => {
  if (!channel.pendingUsers || channel.pendingUsers.length === 0) return null;

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
  getPendingUsersQuery,
  displayLoadingCard,
  pure
)(PendingUsersNotificationPure);

export default PendingUsersNotification;
