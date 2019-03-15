// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import querystring from 'query-string';
import { withRouter } from 'react-router-dom';
import generateMetaInfo from 'shared/generate-meta-info';
import { addCommunityToOnboarding } from 'src/actions/newUserOnboarding';
import Head from 'src/components/head';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import { Link } from 'react-router-dom';
import ThreadFeed from 'src/components/threadFeed';
import PendingUsersNotification from './components/pendingUsersNotification';
import NotificationsToggle from './components/notificationsToggle';
import getChannelThreadConnection from 'shared/graphql/queries/channel/getChannelThreadConnection';
import { getChannelByMatch } from 'shared/graphql/queries/channel/getChannel';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import Login from '../login';
import { Upsell404Channel } from 'src/components/upsell';
import RequestToJoinChannel from 'src/components/upsell/requestToJoinChannel';
import Search from './components/search';
import { CLIENT_URL } from 'src/api/constants';
import CommunityLogin from 'src/views/communityLogin';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { SegmentedControl, Segment } from 'src/components/segmentedControl';
import { ErrorView, LoadingView } from 'src/views/viewHelpers';
import { ChannelProfileCard } from 'src/components/entities';
import { setTitlebarProps } from 'src/actions/titlebar';
import { MobileChannelAction } from 'src/components/titlebar/actions';
import { CommunityAvatar } from 'src/components/avatar';
import {
  PrimaryButton,
  OutlineButton,
} from 'src/views/community/components/button';
import ToggleChannelMembership from 'src/components/toggleChannelMembership';
import { track, events, transformations } from 'src/helpers/analytics';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from 'src/components/error';
import MembersList from './components/MembersList';
import {
  ViewGrid,
  SecondaryPrimaryColumnGrid,
  PrimaryColumn,
  SecondaryColumn,
} from 'src/components/layout';
import { SidebarSection } from 'src/views/community/style';

const ThreadFeedWithData = compose(
  connect(),
  getChannelThreadConnection
)(ThreadFeed);

type Props = {
  match: {
    params: {
      communitySlug: string,
      channelSlug: string,
    },
  },
  data: {
    channel: GetChannelType,
  },
  currentUser: Object,
  isLoading: boolean,
  hasError: boolean,
  dispatch: Dispatch<Object>,
};

class ChannelView extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const { location, history } = props;
    const { search } = location;
    const { tab } = querystring.parse(search);
    if (!tab)
      history.replace({ search: querystring.stringify({ tab: 'posts' }) });
  }

  componentDidMount() {
    if (this.props.data && this.props.data.channel) {
      const { channel } = this.props.data;

      track(events.CHANNEL_VIEWED, {
        channel: transformations.analyticsChannel(channel),
        community: transformations.analyticsCommunity(channel.community),
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { dispatch } = this.props;

    if (this.props.data.channel) {
      const { channel } = this.props.data;
      dispatch(
        setTitlebarProps({
          title: `# ${this.props.data.channel.name}`,
          titleIcon: (
            <CommunityAvatar
              isClickable={false}
              community={channel.community}
              size={24}
            />
          ),
          rightAction: <MobileChannelAction channel={channel} />,
        })
      );
    }

    if (
      (!prevProps.data.channel && this.props.data.channel) ||
      (prevProps.data.channel &&
        this.props.data.channel &&
        prevProps.data.channel.id !== this.props.data.channel.id)
    ) {
      const { channel } = this.props.data;

      if (channel) {
        track(events.CHANNEL_VIEWED, {
          channel: transformations.analyticsChannel(channel),
          community: transformations.analyticsCommunity(channel.community),
        });
      }

      // if the user is new and signed up through a community page, push
      // the community data into the store to hydrate the new user experience
      // with their first community they should join
      if (this.props.currentUser) return;
      this.props.dispatch(
        addCommunityToOnboarding(this.props.data.channel.community)
      );
    }
  }

  handleSegmentClick = (tab: string) => {
    const { history } = this.props;
    return history.replace({ search: querystring.stringify({ tab }) });
  };

  renderActionButton = (channel: GetChannelType) => {
    if (!channel) return null;

    const {
      isOwner: isChannelOwner,
      isMember: isChannelMember,
    } = channel.channelPermissions;
    const { communityPermissions } = channel.community;
    const {
      isOwner: isCommunityOwner,
      isModerator: isCommunityModerator,
    } = communityPermissions;
    const isGlobalOwner = isChannelOwner || isCommunityOwner;
    const isGlobalModerator = isCommunityModerator;

    const loginUrl = channel.community.brandedLogin.isEnabled
      ? `/${channel.community.slug}/login?r=${CLIENT_URL}/${
          channel.community.slug
        }/${channel.slug}`
      : `/login?r=${CLIENT_URL}/${channel.community.slug}/${channel.slug}`;

    // logged in
    if (!this.props.currentUser) {
      // user isnt logged in, prompt a login-join
      return (
        <Link to={loginUrl}>
          <PrimaryButton data-cy="channel-login-join-button">
            Join {channel.name}
          </PrimaryButton>
        </Link>
      );
    }

    // logged out
    if (this.props.currentUser) {
      // show settings button if owns channel or community
      if (isGlobalOwner) {
        return (
          <Link to={`/${channel.community.slug}/${channel.slug}/settings`}>
            <OutlineButton
              icon={'settings'}
              isMember
              data-cy="channel-settings-button"
            >
              Settings
            </OutlineButton>
          </Link>
        );
      }

      if (isGlobalModerator) {
        return (
          <React.Fragment>
            <ToggleChannelMembership
              channel={channel}
              render={state => {
                if (isChannelMember) {
                  return (
                    <OutlineButton
                      loading={state.isLoading}
                      dataCy={'channel-leave-button'}
                    >
                      Leave channel
                    </OutlineButton>
                  );
                } else {
                  return (
                    <PrimaryButton
                      loading={state.isLoading}
                      dataCy="channel-join-button"
                    >
                      Join {channel.name}
                    </PrimaryButton>
                  );
                }
              }}
            />

            <Link to={`/${channel.community.slug}/${channel.slug}/settings`}>
              <OutlineButton
                icon={'settings'}
                isMember
                data-cy="channel-settings-button"
              >
                Settings
              </OutlineButton>
            </Link>
          </React.Fragment>
        );
      }

      // otherwise prompt a join
      return (
        <ToggleChannelMembership
          channel={channel}
          render={state => {
            if (isChannelMember) {
              return (
                <OutlineButton
                  loading={state.isLoading}
                  dataCy={'channel-leave-button'}
                >
                  Leave channel
                </OutlineButton>
              );
            } else {
              return (
                <PrimaryButton
                  loading={state.isLoading}
                  dataCy="channel-join-button"
                >
                  Join {channel.name}
                </PrimaryButton>
              );
            }
          }}
        />
      );
    }
  };

  render() {
    const {
      match,
      data: { channel },
      currentUser,
      isLoading,
      location,
    } = this.props;
    const { communitySlug } = match.params;
    const isLoggedIn = currentUser;
    const { search } = location;
    const { tab } = querystring.parse(search);
    const selectedView = tab;

    if (channel && channel.id) {
      // at this point the view is no longer loading, has not encountered an error, and has returned a channel record
      const {
        isBlocked,
        isPending,
        isMember,
        isOwner,
        isModerator,
      } = channel.channelPermissions;
      const { community } = channel;
      const userHasPermissions = isMember || isOwner || isModerator;
      const isRestricted = channel.isPrivate && !userHasPermissions;
      const hasCommunityPermissions =
        !community.isPrivate || community.communityPermissions.isMember;
      const isGlobalOwner =
        isOwner || channel.community.communityPermissions.isOwner;

      const redirectPath = `${CLIENT_URL}/${community.slug}/${channel.slug}`;

      // if the channel is private but the user isn't logged in, redirect to the login page
      if (!isLoggedIn && channel.isPrivate) {
        if (community.brandedLogin.isEnabled) {
          return <CommunityLogin redirectPath={redirectPath} match={match} />;
        } else {
          return <Login redirectPath={redirectPath} />;
        }
      }

      // user has explicitly been blocked from this channel
      if (
        isBlocked ||
        community.communityPermissions.isBlocked ||
        !hasCommunityPermissions
      ) {
        return (
          <ViewGrid>
            <ViewError
              emoji={'✋'}
              heading={'You don’t have permission to view this channel.'}
              subheading={`Head back to the ${communitySlug} community to get back on track.`}
              dataCy={'channel-view-blocked'}
            >
              <Upsell404Channel community={communitySlug} />
            </ViewError>
          </ViewGrid>
        );
      }

      // channel is private and the user is not a member or owner
      if (isRestricted) {
        return (
          <ViewGrid>
            <ViewError
              emoji={isPending ? '🕓' : '🔑'}
              heading={
                isPending
                  ? 'Your request to join this channel is pending'
                  : 'This channel is private'
              }
              subheading={
                isPending
                  ? `Return to the ${
                      community.name
                    } community until you hear back.`
                  : `Request to join this channel and the admins of ${
                      community.name
                    } will be notified.`
              }
              dataCy={'channel-view-is-restricted'}
            >
              <RequestToJoinChannel
                channel={channel}
                community={community}
                isPending={isPending}
              />
            </ViewError>
          </ViewGrid>
        );
      }

      // at this point the user has full permission to view the channel
      const { title, description } = generateMetaInfo({
        type: 'channel',
        data: {
          name: channel.name,
          communityName: community.name,
          description: channel.description,
        },
      });

      return (
        <React.Fragment>
          <Head
            title={title}
            description={description}
            image={community.profilePhoto}
          />

          <ViewGrid>
            <SecondaryPrimaryColumnGrid data-cy="channel-view">
              <SecondaryColumn>
                <SidebarSection>
                  <ChannelProfileCard channel={channel} />
                </SidebarSection>

                {isLoggedIn && userHasPermissions && !channel.isArchived && (
                  <ErrorBoundary>
                    <SidebarSection>
                      <NotificationsToggle
                        value={channel.channelPermissions.receiveNotifications}
                        channel={channel}
                      />
                    </SidebarSection>
                  </ErrorBoundary>
                )}

                {/* user is signed in and has permissions to view pending users */}
                {isLoggedIn && (isOwner || isGlobalOwner) && (
                  <ErrorBoundary>
                    <PendingUsersNotification
                      channel={channel}
                      id={channel.id}
                    />
                  </ErrorBoundary>
                )}
              </SecondaryColumn>

              <PrimaryColumn>
                <SegmentedControl>
                  <Segment
                    onClick={() => this.handleSegmentClick('posts')}
                    isActive={selectedView === 'posts'}
                  >
                    Posts
                  </Segment>

                  <Segment
                    onClick={() => this.handleSegmentClick('members')}
                    isActive={selectedView === 'members'}
                  >
                    Members
                  </Segment>

                  <Segment
                    onClick={() => this.handleSegmentClick('search')}
                    isActive={selectedView === 'search'}
                    data-cy="channel-search-tab"
                  >
                    Search
                  </Segment>
                </SegmentedControl>

                {// thread list
                selectedView === 'posts' && (
                  <ThreadFeedWithData
                    viewContext="channelProfile"
                    id={channel.id}
                    currentUser={isLoggedIn}
                    channelId={channel.id}
                  />
                )}

                {//search
                selectedView === 'search' && (
                  <ErrorBoundary>
                    <Search channel={channel} />
                  </ErrorBoundary>
                )}

                {// members grid
                selectedView === 'members' && (
                  <ErrorBoundary>
                    <MembersList id={channel.id} />
                  </ErrorBoundary>
                )}
              </PrimaryColumn>
            </SecondaryPrimaryColumnGrid>
          </ViewGrid>
        </React.Fragment>
      );
    }

    if (isLoading) {
      return <LoadingView />;
    }

    return <ErrorView />;
  }
}

export default compose(
  withCurrentUser,
  getChannelByMatch,
  viewNetworkHandler,
  withRouter,
  connect()
)(ChannelView);
