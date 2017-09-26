// @flow
import * as React from 'react';
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
import { LoadingScreen } from '../../components/loading';
import { addToastWithTimeout } from '../../actions/toasts';
import { ChannelEditForm } from '../../components/editForm';
import PendingUsers from './components/pendingUsers';
import BlockedUsers from './components/blockedUsers';
import ChannelMembers from '../../components/channelMembers';
import { Upsell404Channel } from '../../components/upsell';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import {
  togglePendingUserInChannelMutation,
  unblockUserInChannelMutation,
} from '../../api/channel';
import Titlebar from '../titlebar';
import Login from '../login';
import ViewError from '../../components/viewError';

type Props = {
  data: {
    channel: Object,
  },
  match: Object,
  isLoading: boolean,
  hasError: boolean,
  currentUser: Object,
  dispatch: Function,
  togglePendingUser: Function,
  unblockUser: Function,
};

class CommunitySettings extends React.Component<Props> {
  togglePending = (userId, action) => {
    const { data: { channel }, togglePendingUser, dispatch } = this.props;

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

  unblock = (userId: string) => {
    const { data: { channel }, unblockUser, dispatch } = this.props;

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

  render() {
    const {
      match,
      data: { channel },
      isLoading,
      hasError,
      currentUser,
    } = this.props;
    const { communitySlug, channelSlug } = match.params;
    const isLoggedIn = currentUser;

    // if a user isn't logged in they should never be able to view settings
    if (!isLoggedIn) {
      return <Login redirectPath={`${window.location.href}`} />;
    }

    if (isLoading) {
      return <LoadingScreen />;
    }

    if (hasError) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={'Channel not found'}
            provideBack={true}
            backRoute={`/${communitySlug}/${channelSlug}`}
            noComposer
          />
          <ViewError
            refresh
            heading={'There was an error fetching this channel.'}
          />
        </AppViewWrapper>
      );
    }

    if (!channel) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={`Channel not found`}
            provideBack={true}
            backRoute={`/${communitySlug}`}
            noComposer
          />
          <ViewError
            heading={`We couldn’t find a channel with this name.`}
            subheading={`Head back to the ${communitySlug} community to get back on track.`}
          >
            <Upsell404Channel community={communitySlug} />
          </ViewError>
        </AppViewWrapper>
      );
    }

    // at this point the view is no longer loading, has not encountered an error, and has returned a community record
    const { isOwner, isModerator } = channel.channelPermissions;
    const userHasPermissions =
      isOwner ||
      isModerator ||
      channel.community.communityPermissions.isOwner ||
      channel.community.communityPermissions.isModerator;

    if (!userHasPermissions) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={`Channel settings`}
            provideBack={true}
            backRoute={`/${communitySlug}`}
            noComposer
          />
          <ViewError
            heading={`You don’t have permission to manage this channel.`}
            subheading={`Head back to the ${channel.community
              .name} community to get back on track.`}
          >
            <Upsell404Channel community={communitySlug} />
          </ViewError>
        </AppViewWrapper>
      );
    }

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
          {channel.isPrivate && (
            <span>
              <PendingUsers
                togglePending={this.togglePending}
                channel={channel}
                id={channel.id}
              />
              <BlockedUsers
                unblock={this.unblock}
                channel={channel}
                id={channel.id}
              />
            </span>
          )}
          {!channel.isPrivate && <ChannelMembers id={channel.id} />}
        </Column>
      </AppViewWrapper>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
});

export default compose(
  connect(map),
  getThisChannel,
  togglePendingUserInChannelMutation,
  unblockUserInChannelMutation,
  viewNetworkHandler,
  pure
)(CommunitySettings);
