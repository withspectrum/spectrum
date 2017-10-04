import * as React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import generateMetaInfo from 'shared/generate-meta-info';
import { addCommunityToOnboarding } from '../../actions/newUserOnboarding';
import ThreadComposer from '../../components/threadComposer';
import Head from '../../components/head';
import AppViewWrapper from '../../components/appViewWrapper';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import ViewError from '../../components/viewError';
import Column from '../../components/column';
import ThreadFeed from '../../components/threadFeed';
import { ChannelProfile } from '../../components/profile';
import PendingUsersNotification from './components/pendingUsersNotification';
import NotificationsToggle from './components/notificationsToggle';
import { getChannelThreads, getChannel } from './queries';
import Login from '../login';
import { LoadingScreen } from '../../components/loading';
import { UpsellSignIn, Upsell404Channel } from '../../components/upsell';
import RequestToJoinChannel from '../../components/upsell/requestToJoinChannel';
import { UpsellUpgradeCommunityPrivateChannel } from '../communitySettings/components/upgradeCommunity';
import Titlebar from '../titlebar';

const ThreadFeedWithData = compose(connect(), getChannelThreads)(ThreadFeed);

type Props = {
  match: {
    params: {
      communitySlug: string,
      channelSlug: string,
    },
  },
  data: {
    channel: Object,
  },
  currentUser: Object,
  isLoading: boolean,
  hasError: boolean,
  dispatch: Function,
};

class ChannelView extends React.Component<Props> {
  render() {
    const {
      match,
      data: { channel },
      currentUser,
      isLoading,
      hasError,
    } = this.props;
    const { communitySlug, channelSlug } = match.params;
    const isLoggedIn = currentUser;

    if (channel) {
      // at this point the view is no longer loading, has not encountered an error, and has returned a community record
      const {
        isBlocked,
        isPending,
        isMember,
        isOwner,
        isModerator,
      } = channel.channelPermissions;
      const userHasPermissions = isMember || isOwner || isModerator;
      const isRestricted = channel.isPrivate && !userHasPermissions;
      const isGlobalOwner =
        isOwner || channel.community.communityPermissions.isOwner;

      // if the channel is private but the user isn't logged in, redirect to the login page
      if (!isLoggedIn && channel.isPrivate) {
        return <Login redirectPath={`${window.location.href}`} />;
      }

      // user has explicitly been blocked from this channel
      if (isBlocked) {
        return (
          <AppViewWrapper>
            <Titlebar
              title={'Private channel'}
              provideBack={true}
              backRoute={`/${communitySlug}`}
              noComposer
            />
            <ViewError
              heading={`You don’t have permission to view this channel.`}
              subheading={`Head back to the ${communitySlug} community to get back on track.`}
            >
              <Upsell404Channel community={communitySlug} />
            </ViewError>
          </AppViewWrapper>
        );
      }

      // channel is private and the user is not a member or owner
      if (isRestricted) {
        return (
          <AppViewWrapper>
            <Titlebar
              title={channel.name}
              subtitle={channel.community.name}
              provideBack={true}
              backRoute={`/${communitySlug}`}
              noComposer
            />
            <ViewError
              emoji={isPending ? '🕓' : '🔑'}
              heading={
                isPending
                  ? `Your request to join this channel is pending`
                  : `This channel is private`
              }
              subheading={
                isPending
                  ? `Return to the ${channel.community
                      .name} community until you hear back.`
                  : `Request to join this channel and the admins of ${channel
                      .community.name} will be notified.`
              }
            >
              <RequestToJoinChannel
                channel={channel}
                community={channel.community}
                isPending={isPending}
              />
            </ViewError>
          </AppViewWrapper>
        );
      }

      // at this point the user has full permission to view the channel
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

      return (
        <AppViewWrapper>
          <Head title={title} description={description} />
          <Titlebar
            title={channel.name}
            subtitle={channel.community.name}
            provideBack={true}
            backRoute={`/${communitySlug}`}
            noComposer={!isMember}
          />
          <Column type="secondary">
            <ChannelProfile data={{ channel }} profileSize="full" />

            {/* user is signed in and is a member of the channel */}
            {isLoggedIn &&
              userHasPermissions && (
                <NotificationsToggle
                  value={channel.channelPermissions.receiveNotifications}
                  channel={channel}
                />
              )}

            {/* user is signed in and has permissions to view pending users */}
            {isLoggedIn &&
              (isOwner || isGlobalOwner) && (
                <PendingUsersNotification channel={channel} id={channel.id} />
              )}
          </Column>

          <Column type="primary" alignItems="center">
            {!isLoggedIn && (
              <UpsellSignIn view={{ data: channel, type: 'channel' }} />
            )}

            {/* if the user is logged in and has permission to post, but the channel is private in an unpaid community, return an upsell to upgrade the community */}
            {isLoggedIn &&
              userHasPermissions &&
              channel.isPrivate &&
              !channel.community.isPro && (
                <UpsellUpgradeCommunityPrivateChannel
                  community={channel.community}
                />
              )}

            {/* if the user is logged in and has permissions to post, and the channel is either private + paid, or is not private, show the composer */}
            {isLoggedIn &&
              userHasPermissions &&
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
              currentUser={isLoggedIn}
              channelId={channel.id}
            />
          </Column>
        </AppViewWrapper>
      );
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
            backRoute={`/${communitySlug}`}
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

const map = state => ({
  currentUser: state.users.currentUser,
});

export default compose(connect(map), getChannel, viewNetworkHandler, pure)(
  ChannelView
);
