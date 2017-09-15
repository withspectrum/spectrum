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
import { addCommunityToOnboarding } from '../../actions/newUserOnboarding';
import ThreadComposer from '../../components/threadComposer';
import Head from '../../components/head';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import ThreadFeed from '../../components/threadFeed';
import { ChannelProfile } from '../../components/profile';
import PendingUsersNotification from './components/pendingUsersNotification';
import NotificationsToggle from './components/notificationsToggle';
import { getChannelThreads, getChannel } from './queries';
import {
  LoadingProfile,
  LoadingList,
  LoadingComposer,
  LoadingFeed,
} from '../../components/loading';
import {
  UpsellSignIn,
  Upsell404Channel,
  UpsellRequestToJoinChannel,
} from '../../components/upsell';
import { UpsellUpgradeCommunityPrivateChannel } from '../communitySettings/components/upgradeCommunity';
import Titlebar from '../titlebar';

const ThreadFeedWithData = compose(connect(), getChannelThreads)(ThreadFeed);

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
          ? `Requested to join ${toggleChannelSubscription.name} in ${toggleChannelSubscription
              .community.name}!`
          : `Canceled request to join ${toggleChannelSubscription.name} in ${toggleChannelSubscription
              .community.name}.`;

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
    const {
      match,
      data: { channel, networkStatus, user, error },
      currentUser,
    } = this.props;
    const { isLoading } = this.state;
    const isMobile = window.innerWidth < 768;
    const { communitySlug, channelSlug } = match.params;
    const loggedInUser = user || currentUser;
    const dataExists =
      channel && !channel.isDeleted && channel.channelPermissions;
    const isBlocked = dataExists && channel.channelPermissions.isBlocked;
    const hasRights =
      dataExists &&
      (channel.channelPermissions.isMember ||
        channel.channelPermissions.isOwner);
    const isRestricted = dataExists && (channel.isPrivate && !hasRights);
    const isOwner =
      dataExists &&
      (channel.channelPermissions.isOwner ||
        channel.community.communityPermissions.isOwner);

    if (networkStatus === 8 || error) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={'Channel Not Found'}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <Column type="primary" alignItems="center">
            <Upsell404Channel channel={channelSlug} community={communitySlug} />
          </Column>
        </AppViewWrapper>
      );
    }

    if (dataExists) {
      if (isBlocked) {
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
      } else if (isRestricted) {
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
                currentUser={loggedInUser}
                loading={isLoading}
              />
            </Column>
          </AppViewWrapper>
        );
      } else {
        const { title, description } = generateMetaInfo({
          type: 'channel',
          data: {
            name: channel.name,
            communityName: channel.community.name,
            description: channel.description,
          },
        });

        // if the user is new and signed up through a channel page, push
        // the channel's community data into the store to hydrate the new user experience
        // with their first community they should join
        this.props.dispatch(addCommunityToOnboarding(channel.community));

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

              {loggedInUser &&
              hasRights && (
                <NotificationsToggle
                  value={channel.channelPermissions.receiveNotifications}
                  channel={channel}
                />
              )}

              {loggedInUser &&
              isOwner && (
                <PendingUsersNotification channel={channel} id={channel.id} />
              )}
            </Column>

            <Column type="primary" alignItems="center">
              {!loggedInUser && (
                <UpsellSignIn view={{ data: channel, type: 'channel' }} />
              )}

              {loggedInUser &&
              hasRights &&
              channel.isPrivate &&
              !channel.community.isPro && (
                <UpsellUpgradeCommunityPrivateChannel
                  community={channel.community}
                />
              )}

              {loggedInUser &&
              hasRights &&
              ((channel.isPrivate && channel.community.isPro) ||
                !channel.isPrivate) && (
                <ThreadComposer
                  activeCommunity={communitySlug}
                  activeChannel={channelSlug}
                />
              )}

              <ThreadFeedWithData
                viewContext="channel"
                channelSlug={channelSlug}
                communitySlug={communitySlug}
                currentUser={loggedInUser}
                channelId={channel.id}
              />
            </Column>
          </AppViewWrapper>
        );
      }
    }

    if (networkStatus === 7) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={'Channel Not Found'}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <Column type="primary" alignItems="center">
            <Upsell404Channel channel={channelSlug} community={communitySlug} />
          </Column>
        </AppViewWrapper>
      );
    } else {
      return (
        <AppViewWrapper>
          <Titlebar noComposer />
          {!isMobile && (
            <Column type="secondary">
              <LoadingProfile />
              <LoadingList />
            </Column>
          )}
          <Column type="primary">
            {!isMobile && <LoadingComposer />}
            <LoadingFeed />
          </Column>
        </AppViewWrapper>
      );
    }
  }
}

export const ChannelView = compose(
  getChannel,
  toggleChannelSubscriptionMutation,
  pure
)(ChannelViewPure);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(ChannelView);
