// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import { connect } from 'react-redux';
import { getThisChannel } from './queries';
import { track } from '../../helpers/events';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import { displayLoadingDashboard } from '../../components/loading';
import { addToastWithTimeout } from '../../actions/toasts';
import { ChannelEditForm } from '../../components/editForm';
import PendingUsers from './components/pendingUsers';
import BlockedUsers from './components/blockedUsers';
import { Upsell404Channel } from '../../components/upsell';
import {
  togglePendingUserInChannelMutation,
  unblockUserInChannelMutation,
} from '../../api/channel';
import Titlebar from '../titlebar';

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
    return (
      <AppViewWrapper>
        <Titlebar
          title={'Channel Not Found'}
          provideBack={true}
          backRoute={`/`}
          noComposer
        />
        <Column type="primary">
          <Upsell404Channel channel={channelSlug} community={communitySlug} />
        </Column>
      </AppViewWrapper>
    );
  }

  if (!channel || channel.isDeleted) {
    return (
      <AppViewWrapper>
        <Titlebar
          title={'Channel Not Found'}
          provideBack={true}
          backRoute={`/`}
          noComposer
        />
        <Column type="primary">
          <Upsell404Channel channel={channelSlug} community={communitySlug} />
        </Column>
      </AppViewWrapper>
    );
  }

  if (
    !channel.channelPermissions.isOwner &&
    !channel.community.communityPermissions.isOwner
  ) {
    return (
      <AppViewWrapper>
        <Titlebar
          title={'No Permission'}
          provideBack={true}
          backRoute={`/${communitySlug}`}
          noComposer
        />

        <Column type="primary">
          <Upsell404Channel
            channel={channelSlug}
            community={communitySlug}
            noPermission
          />
        </Column>
      </AppViewWrapper>
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
          if (action === 'block') {
            track('channel', 'blocked pending user', null);
          }

          if (action === 'approve') {
            track('channel', 'approved pending user', null);
          }

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
          track('channel', 'unblocked user', null);
          dispatch(addToastWithTimeout('success', 'User was un-blocked.'));
        }
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  track('channel', 'settings viewed', null);

  return (
    <AppViewWrapper>
      <Titlebar
        title={`${channel.name} · ${channel.community.name}`}
        subtitle={'Settings'}
        provideBack={true}
        backRoute={`/${channel.community.slug}/${channel.slug}`}
        noComposer
      />
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
  displayLoadingDashboard,
  pure
)(SettingsPure);
export default connect()(ChannelSettings);
