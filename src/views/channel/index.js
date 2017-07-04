// @flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { track } from '../../helpers/events';
import generateMetaInfo from 'shared/generate-meta-info';
import { toggleChannelSubscriptionMutation } from '../../api/channel';
import { addToastWithTimeout } from '../../actions/toasts';
import ThreadComposer from '../../components/threadComposer';
import Head from '../../components/head';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import ThreadFeed from '../../components/threadFeed';
import { ChannelProfile } from '../../components/profile';
import PendingUsersNotification from './components/pendingUsersNotification';
import NotificationsToggle from './components/notificationsToggle';
import { getChannelThreads, getChannel } from './queries';
import { displayLoadingScreen } from '../../components/loading';
import {
  UpsellSignIn,
  Upsell404Channel,
  UpsellRequestToJoinChannel,
} from '../../components/upsell';
import Titlebar from '../titlebar';

const ThreadFeedWithData = compose(getChannelThreads)(ThreadFeed);

class ChannelViewPure extends Component {
  state: {
    isLoading: boolean,
  };

  constructor() {
    super();

    this.state = {
      isLoading: false,
    };
  }

  toggleRequest = channelId => {
    const { toggleChannelSubscription, dispatch } = this.props;
    this.setState({
      isLoading: true,
    });

    toggleChannelSubscription({ channelId })
      .then(({ data: { toggleChannelSubscription } }) => {
        this.setState({
          isLoading: false,
        });

        const isPending =
          toggleChannelSubscription.channelPermissions.isPending;

        if (isPending) {
          track('channel', 'requested to join', null);
        } else {
          track('channel', 'cancelled request to join', null);
        }

        const str = isPending
          ? `Requested to join ${toggleChannelSubscription.name} in ${toggleChannelSubscription.community.name}!`
          : `Canceled request to join ${toggleChannelSubscription.name} in ${toggleChannelSubscription.community.name}.`;

        const type = isPending ? 'success' : 'neutral';
        dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });

        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { match, data: { error, channel }, currentUser } = this.props;
    const { isLoading } = this.state;
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
          <Column type="primary" alignItems="center">
            <Upsell404Channel
              channel={match.params.channelSlug}
              community={match.params.communitySlug}
            />
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
          <Column type="primary" alignItems="center">
            <Upsell404Channel
              channel={match.params.channelSlug}
              community={match.params.communitySlug}
            />
          </Column>
        </AppViewWrapper>
      );
    }

    // user has been blocked by the owners
    if (channel && channel.channelPermissions.isBlocked) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={'Private Channel'}
            provideBack={true}
            backRoute={`/${match.params.communitySlug}`}
            noComposer
          />
          <Column type="primary" alignItems="center">
            <Upsell404Channel
              channel={match.params.channelSlug}
              community={match.params.communitySlug}
              noPermission
            />
          </Column>
        </AppViewWrapper>
      );
    }
    // channel exists and the user is not a subscriber (accounts for signed-
    // out users as well)
    if (
      channel &&
      channel.isPrivate &&
      (!channel.channelPermissions.isMember &&
        !channel.community.communityPermissions.isOwner)
    ) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={channel.name}
            subtitle={channel.community.name}
            provideBack={true}
            backRoute={`/${channel.community.slug}`}
            noComposer
          />
          <Column type="primary" alignItems="center">
            <UpsellRequestToJoinChannel
              channel={channel}
              community={match.params.communitySlug}
              isPending={channel.channelPermissions.isPending}
              subscribe={this.toggleRequest}
              currentUser={currentUser}
              loading={isLoading}
            />
          </Column>
        </AppViewWrapper>
      );
    }

    // channel exists and
    // the channel is private + user is a subscriber
    // or channel is not private
    if (
      channel &&
      ((channel.isPrivate && channel.channelPermissions.isMember) ||
        channel.community.communityPermissions.isOwner ||
        !channel.isPrivate)
    ) {
      const { title, description } = generateMetaInfo({
        type: 'channel',
        data: {
          name: channel.name,
          communityName: channel.community.name,
          description: channel.description,
        },
      });

      track('channel', 'profile viewed', null);

      return (
        <AppViewWrapper>
          <Head title={title} description={description} />
          <Titlebar
            title={channel.name}
            subtitle={channel.community.name}
            provideBack={true}
            backRoute={`/${channel.community.slug}`}
            noComposer={!channel.channelPermissions.isMember}
          />
          <Column type="secondary">
            <ChannelProfile data={{ channel }} profileSize="full" />

            {currentUser &&
              channel.channelPermissions.isMember &&
              <NotificationsToggle
                value={channel.channelPermissions.receiveNotifications}
                channel={channel}
              />}

            {channel.isPrivate &&
              (channel.channelPermissions.isOwner ||
                channel.community.communityPermissions.isOwner) &&
              <PendingUsersNotification channel={channel} id={channel.id} />}
          </Column>

          <Column type="primary" alignItems="center">
            {!currentUser && <UpsellSignIn entity={channel} />}

            {channel.channelPermissions.isMember && currentUser
              ? <ThreadComposer
                  activeCommunity={communitySlug}
                  activeChannel={match.params.channelSlug}
                />
              : <span />}
            <ThreadFeedWithData
              viewContext="channel"
              channelSlug={channelSlug}
              communitySlug={communitySlug}
              currentUser={currentUser}
            />
          </Column>
        </AppViewWrapper>
      );
    }
  }
}

export const ChannelView = compose(
  getChannel,
  toggleChannelSubscriptionMutation,
  displayLoadingScreen,
  pure
)(ChannelViewPure);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(ChannelView);
