// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getChannelByMatch } from 'shared/graphql/queries/channel/getChannel';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import AppViewWrapper from 'src/components/appViewWrapper';
import { Loading } from 'src/components/loading';
import { addToastWithTimeout } from 'src/actions/toasts';
import { Upsell404Channel } from 'src/components/upsell';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import togglePendingUserInChannelMutation from 'shared/graphql/mutations/channel/toggleChannelPendingUser';
import type { ToggleChannelPendingUserType } from 'shared/graphql/mutations/channel/toggleChannelPendingUser';
import unblockUserInChannelMutation from 'shared/graphql/mutations/channel/unblockChannelBlockedUser';
import type { UnblockChannelBlockedUserType } from 'shared/graphql/mutations/channel/unblockChannelBlockedUser';
import Titlebar from '../titlebar';
import ViewError from 'src/components/viewError';
import { View } from 'src/components/settingsViews/style';
import Header from 'src/components/settingsViews/header';
import Overview from './components/overview';
import Subnav from 'src/components/settingsViews/subnav';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';

type Props = {
  data: {
    channel: GetChannelType,
  },
  location: Object,
  match: Object,
  isLoading: boolean,
  hasError: boolean,
  dispatch: Function,
  togglePendingUser: Function,
  unblockUser: Function,
  history: Object,
};

class ChannelSettings extends React.Component<Props> {
  initMessage = user => {
    this.props.dispatch(initNewThreadWithUser(user));
    return this.props.history.push('/messages/new');
  };

  togglePending = (userId, action) => {
    const { data: { channel }, dispatch } = this.props;
    const input = {
      channelId: channel.id,
      userId,
      action,
    };

    this.props
      .togglePendingUser(input)
      .then(({ data }: ToggleChannelPendingUserType) => {
        // the mutation returns a channel object. if it exists,
        const { togglePendingUser } = data;
        if (togglePendingUser !== undefined) {
          if (action === 'block') {
          }

          if (action === 'approve') {
          }

          dispatch(addToastWithTimeout('success', 'Saved!'));
        }
        return;
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  unblock = (userId: string) => {
    const { data: { channel }, dispatch } = this.props;

    const input = {
      channelId: channel.id,
      userId,
    };

    this.props
      .unblockUser(input)
      .then(({ data }: UnblockChannelBlockedUserType) => {
        const { unblockUser } = data;
        // the mutation returns a channel object. if it exists,
        if (unblockUser !== undefined) {
          dispatch(addToastWithTimeout('success', 'User was un-blocked.'));
        }
        return;
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

    if (channel && channel.id) {
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
              title={'Channel settings'}
              provideBack={true}
              backRoute={`/${communitySlug}`}
              noComposer
            />
            <ViewError
              heading={'You don’t have permission to manage this channel.'}
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
                initMessage={this.initMessage}
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

          <View id="main">
            <Header
              subheading={subheading}
              heading={`${channel.name} Settings ${
                channel.isArchived ? '(Archived)' : ''
              }`}
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
          title={'Channel not found'}
          provideBack={true}
          backRoute={`/${communitySlug}`}
          noComposer
        />
        <ViewError
          heading={'We couldn’t find a channel with this name.'}
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
  withRouter,
  getChannelByMatch,
  togglePendingUserInChannelMutation,
  unblockUserInChannelMutation,
  viewNetworkHandler
)(ChannelSettings);
