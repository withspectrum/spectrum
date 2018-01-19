// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { getChannelBySlugAndCommunitySlug } from 'shared/graphql/queries/channel/getChannel';
import { track } from '../../helpers/events';
import AppViewWrapper from '../../components/appViewWrapper';
import { Loading } from '../../components/loading';
import { addToastWithTimeout } from '../../actions/toasts';
import { Upsell404Channel } from '../../components/upsell';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import togglePendingUserInChannelMutation from 'shared/graphql/mutations/channel/toggleChannelPendingUser';
import unblockUserInChannelMutation from 'shared/graphql/mutations/channel/unblockChannelBlockedUser';
import Titlebar from '../titlebar';
import ViewError from '../../components/viewError';
import { View } from '../../components/settingsViews/style';
import Header from '../../components/settingsViews/header';
import Overview from './components/overview';
import Subnav from '../../components/settingsViews/subnav';

type Props = {
  data: {
    channel: Object,
  },
  location: Object,
  match: Object,
  isLoading: boolean,
  hasError: boolean,
  dispatch: Function,
  togglePendingUser: Function,
  unblockUser: Function,
};

class ChannelSettings extends React.Component<Props> {
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
      data: { channel },
      match,
      location,
      isLoading,
      hasError,
    } = this.props;
    const { communitySlug, channelSlug } = match.params;

    // this is hacky, but will tell us if we're viewing analytics or the root settings view
    const pathname = location.pathname;
    const lastIndex = pathname.lastIndexOf('/');
    const activeTab = pathname.substr(lastIndex + 1);

    if (channel) {
      const { isModerator, isOwner } = channel.channelPermissions;
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
              subheading={`Head back to the ${
                channel.community.name
              } community to get back on track.`}
            >
              <Upsell404Channel community={communitySlug} />
            </ViewError>
          </AppViewWrapper>
        );
      }

      const ActiveView = () => {
        switch (activeTab) {
          case 'settings':
            return (
              <Overview
                community={channel.community}
                channel={channel}
                communitySlug={communitySlug}
                togglePending={this.togglePending}
                unblock={this.unblock}
              />
            );
          default:
            return null;
        }
      };

      const subnavItems = [
        {
          to: `/${channel.community.slug}/${channel.slug}/settings`,
          label: 'Overview',
          activeLabel: 'settings',
        },
      ];

      const subheading = {
        to: `/${channel.community.slug}/settings`,
        label: `Return to ${channel.community.name} settings`,
      };

      return (
        <AppViewWrapper>
          <Titlebar
            title={`${channel.name} · ${channel.community.name}`}
            subtitle={'Settings'}
            provideBack={true}
            backRoute={`/${channel.community.slug}/${channel.slug}`}
            noComposer
          />

          <View>
            <Header
              subheading={subheading}
              heading={`${channel.name} Settings`}
            />
            <Subnav items={subnavItems} activeTab={activeTab} />

            <ActiveView />
          </View>
        </AppViewWrapper>
      );
    }

    if (isLoading) {
      return <Loading />;
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
}

export default compose(
  // $FlowIssue
  connect(),
  getChannelBySlugAndCommunitySlug,
  togglePendingUserInChannelMutation,
  unblockUserInChannelMutation,
  viewNetworkHandler
)(ChannelSettings);
