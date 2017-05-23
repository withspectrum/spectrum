// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import { connect } from 'react-redux';
import { getThisChannel } from './queries';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import { displayLoadingScreen } from '../../components/loading';
import { addToastWithTimeout } from '../../actions/toasts';
import { ChannelEditForm } from '../../components/editForm';
import PendingUsers from './components/pendingUsers';
import BlockedUsers from './components/blockedUsers';
import { Upsell404Channel } from '../../components/upsell';
import {
  togglePendingUserInChannelMutation,
  unblockUserInChannelMutation,
} from '../../api/channel';

const SettingsPure = ({
  match,
  data: { error, channel },
  dispatch,
  history,
  togglePendingUser,
  unblockUser,
}) => {
  const communitySlug = match.params.communitySlug;
  const channelSlug = match.params.channelSlug;

  if (error) {
    return <Upsell404Channel channel={channelSlug} community={communitySlug} />;
  }

  if (!channel || channel.isDeleted) {
    return <Upsell404Channel channel={channelSlug} community={communitySlug} />;
  }

  if (
    !channel.channelPermissions.isOwner &&
    !channel.community.communityPermissions.isOwner
  ) {
    return (
      <Upsell404Channel
        channel={channelSlug}
        community={communitySlug}
        noPermission
      />
    );
  }

  const togglePending = (userId, action) => {
    const input = {
      channelId: channel.id,
      userId,
      action,
    };

    togglePendingUser(input)
      .then(({ data: { togglePendingUser } }) => {
        // the mutation returns a channel object. if it exists,
        if (togglePendingUser !== undefined) {
          dispatch(addToastWithTimeout('success', 'Saved!'));
        }
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  const unblock = userId => {
    const input = {
      channelId: channel.id,
      userId,
    };

    unblockUser(input)
      .then(({ data: { unblockUser } }) => {
        // the mutation returns a channel object. if it exists,
        if (unblockUser !== undefined) {
          dispatch(addToastWithTimeout('success', 'User was un-blocked.'));
        }
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <ChannelEditForm channel={channel} />
      </Column>
      <Column type="primary">
        <PendingUsers
          users={channel.pendingUsers}
          togglePending={togglePending}
          channel={channel}
        />
        {channel.blockedUsers.length > 0 &&
          <BlockedUsers
            users={channel.blockedUsers}
            unblock={unblock}
            channel={channel}
          />}
      </Column>
    </AppViewWrapper>
  );
};

const ChannelSettings = compose(
  getThisChannel,
  togglePendingUserInChannelMutation,
  unblockUserInChannelMutation,
  displayLoadingScreen,
  pure
)(SettingsPure);
export default connect()(ChannelSettings);
