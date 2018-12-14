// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'src/components/buttons';
import generateMetaInfo from 'shared/generate-meta-info';
import ThreadComposer from 'src/components/threadComposer';
import Head from 'src/components/head';
import Icon from 'src/components/icons';
import AppViewWrapper from 'src/components/appViewWrapper';
import ThreadFeed from 'src/components/threadFeed';
import Search from './components/search';
import CommunityMemberGrid from './components/memberGrid';
import ToggleCommunityMembership from 'src/components/toggleCommunityMembership';
import { addCommunityToOnboarding } from 'src/actions/newUserOnboarding';
import { CoverPhoto } from 'src/components/profile/coverPhoto';
import Titlebar from '../titlebar';
import { CommunityProfile } from 'src/components/profile';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import type { ViewNetworkHandlerType } from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import { LoadingScreen } from 'src/components/loading';
import { CLIENT_URL } from 'src/api/constants';
import { Upsell404Community } from 'src/components/upsell';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  SegmentedControl,
  Segment,
  DesktopSegment,
  MobileSegment,
} from 'src/components/segmentedControl';
import {
  LoginButton,
  LoginOutlineButton,
  SettingsButton,
  Grid,
  Meta,
  Content,
  Extras,
  ColumnHeading,
} from './style';
import getCommunityThreads from 'shared/graphql/queries/community/getCommunityThreadConnection';
import {
  getCommunityByMatch,
  type GetCommunityType,
} from 'shared/graphql/queries/community/getCommunity';
import ChannelList from './components/channelList';
import ModeratorList from './components/moderatorList';
import { track, events, transformations } from 'src/helpers/analytics';
import RequestToJoinCommunity from './components/requestToJoinCommunity';
import CommunityLogin from 'src/views/communityLogin';
import Login from 'src/views/login';
import { ErrorBoundary } from 'src/components/error';

const CommunityThreadFeed = compose(
  connect(),
  getCommunityThreads
)(ThreadFeed);

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  dispatch: Dispatch<Object>,
  toggleCommunityMembership: Function,
  currentUser: Object,
  match: {
    params: {
      communitySlug: string,
    },
  },
  data: {
    community: GetCommunityType,
  },
};

type State = {
  showComposerUpsell: boolean,
  selectedView: 'trending-threads' | 'threads' | 'search' | 'members',
  isLeavingCommunity: boolean,
};

class CommunityView extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      isLeavingCommunity: false,
      showComposerUpsell: false,
      selectedView: 'trending-threads',
    };
  }

  componentDidMount() {
    if (this.props.data && this.props.data.community) {
      track(events.COMMUNITY_VIEWED, {
        community: transformations.analyticsCommunity(
          this.props.data.community
        ),
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { community: prevCommunity } = prevProps.data;
    const { community: currCommunity } = this.props.data;
    if (
      (!prevCommunity && currCommunity && currCommunity.id) ||
      (prevCommunity && prevCommunity.id !== currCommunity.id)
    ) {
      track(events.COMMUNITY_VIEWED, {
        community: transformations.analyticsCommunity(currCommunity),
      });

      // if the user is new and signed up through a community page, push
      // the community data into the store to hydrate the new user experience
      // with their first community they should join
      if (!this.props.currentUser || !this.props.currentUser.username) {
        return this.props.dispatch(addCommunityToOnboarding(currCommunity));
      }
    }
  }

  setComposerUpsell = () => {
    const {
      data: { community },
    } = this.props;
    const communityExists = community && community.communityPermissions;
    if (!communityExists) return;

    const isNewAndOwned =
      community.communityPermissions.isOwner && community.metaData.members < 2;
    return this.setState({ showComposerUpsell: isNewAndOwned });
  };

  handleSegmentClick = label => {
    if (this.state.selectedView === label) return;

    return this.setState({
      selectedView: label,
    });
  };

  render() {
    const {
      match: { params },
      data: { community },
      currentUser,
      isLoading,
      hasError,
      match,
    } = this.props;
    const { communitySlug } = params;

    if (community && community.id) {
      // at this point the community exists and was fetched
      const { title, description } = generateMetaInfo({
        type: 'community',
        data: {
          name: community.name,
          description: community.description,
        },
      });

      const { showComposerUpsell, selectedView } = this.state;
      const {
        isMember,
        isOwner,
        isModerator,
        isPending,
        isBlocked,
      } = community.communityPermissions;
      const userHasPermissions = isMember || isOwner || isModerator;
      const isLoggedIn = currentUser;

      if (isBlocked) {
        return (
          <AppViewWrapper data-cy="community-view">
            <Titlebar
              title={community.name}
              provideBack={true}
              backRoute={'/'}
              noComposer
            />

            <Head
              title={title}
              description={description}
              image={community.profilePhoto}
            />

            <ViewError
              id="main"
              emoji={'✋'}
              heading={`You don’t have permission to view ${community.name}`}
              subheading={'Head back home to get on track.'}
            >
              <Link to={'/'}>
                <Button large>Take me home</Button>
              </Link>
            </ViewError>
          </AppViewWrapper>
        );
      }

      const redirectPath = `${CLIENT_URL}/${community.slug}`;

      if (!currentUser && community.isPrivate) {
        if (community.brandedLogin.isEnabled) {
          return <CommunityLogin redirectPath={redirectPath} match={match} />;
        } else {
          return <Login redirectPath={redirectPath} />;
        }
      }

      if (community.isPrivate && (!isLoggedIn || !userHasPermissions)) {
        return (
          <AppViewWrapper data-cy="community-view-blocked">
            <Head
              title={title}
              description={`The ${community.name} community on Spectrum`}
              image={community.profilePhoto}
            />

            <Titlebar
              title={community.name}
              provideBack={true}
              backRoute={'/'}
              noComposer
            />

            <ViewError
              emoji={isPending ? '🕓' : '🔑'}
              heading={
                isPending
                  ? 'Your request to join this community is pending'
                  : 'This community is private'
              }
              subheading={
                isPending
                  ? `Return home until you hear back.`
                  : `Request to join this community and the admins of ${
                      community.name
                    } will be notified.`
              }
              dataCy={'community-view-is-restricted'}
            >
              <RequestToJoinCommunity community={community} />
            </ViewError>
          </AppViewWrapper>
        );
      }

      // if the person viewing the community recently created this community,
      // we'll mark it as "new and owned" - this tells the downstream
      // components to show nux upsells to create a thread or invite people
      // to the community
      const isNewAndOwned = isOwner && community.metaData.members < 5;
      const loginUrl = community.brandedLogin.isEnabled
        ? `/${community.slug}/login?r=${CLIENT_URL}/${community.slug}`
        : `/login?r=${CLIENT_URL}/${community.slug}`;
      return (
        <AppViewWrapper data-cy="community-view">
          <Head
            title={title}
            description={description}
            image={community.profilePhoto}
          />
          <Titlebar
            title={community.name}
            provideBack={true}
            backRoute={'/'}
            noComposer={!community.communityPermissions.isMember}
            activeCommunitySlug={community.slug}
          />
          <Grid id="main">
            <CoverPhoto src={community.coverPhoto} />
            <Meta>
              <ErrorBoundary fallbackComponent={null}>
                <CommunityProfile
                  data={{ community }}
                  profileSize="full"
                  showHoverProfile={false}
                />
              </ErrorBoundary>

              {!isLoggedIn ? (
                <Link to={loginUrl}>
                  <LoginButton dataCy={'join-community-button-login'}>
                    Join {community.name}
                  </LoginButton>
                </Link>
              ) : !isOwner ? (
                <ToggleCommunityMembership
                  community={community}
                  render={state => {
                    if (isMember) {
                      return (
                        <LoginOutlineButton
                          loading={state.isLoading}
                          dataCy={'leave-community-button'}
                        >
                          Leave community
                        </LoginOutlineButton>
                      );
                    } else {
                      return (
                        <LoginButton
                          loading={state.isLoading}
                          dataCy={'join-community-button'}
                        >
                          Join {community.name}
                        </LoginButton>
                      );
                    }
                  }}
                />
              ) : null}

              {currentUser && (isOwner || isModerator) && (
                <Link to={`/${community.slug}/settings`}>
                  <SettingsButton
                    icon={'settings'}
                    isMember
                    data-cy="community-settings-button"
                  >
                    Settings
                  </SettingsButton>
                </Link>
              )}
            </Meta>
            <Content data-cy="community-view-content">
              <SegmentedControl
                style={{
                  margin: '16px 0 0 0',
                }}
              >
                <DesktopSegment
                  segmentLabel="search"
                  onClick={() => this.handleSegmentClick('search')}
                  selected={selectedView === 'search'}
                >
                  <Icon glyph={'search'} />
                  Search
                </DesktopSegment>

                <MobileSegment
                  segmentLabel="search"
                  onClick={() => this.handleSegmentClick('search')}
                  selected={selectedView === 'search'}
                >
                  <Icon glyph={'search'} />
                </MobileSegment>

                <Segment
                  segmentLabel="trending-threads"
                  onClick={() => this.handleSegmentClick('trending-threads')}
                  selected={selectedView === 'trending-threads'}
                >
                  Trending
                </Segment>

                <Segment
                  segmentLabel="threads"
                  onClick={() => this.handleSegmentClick('threads')}
                  selected={selectedView === 'threads'}
                >
                  Latest
                </Segment>

                <DesktopSegment
                  segmentLabel="members"
                  onClick={() => this.handleSegmentClick('members')}
                  selected={selectedView === 'members'}
                >
                  Members
                </DesktopSegment>
                <MobileSegment
                  segmentLabel="members"
                  onClick={() => this.handleSegmentClick('members')}
                  selected={selectedView === 'members'}
                >
                  Members
                </MobileSegment>
              </SegmentedControl>

              {// if the user is logged in, is viewing the threads,
              // and is a member of the community, they should see a
              // new thread composer
              isLoggedIn &&
                (selectedView === 'threads' ||
                  selectedView === 'trending-threads') &&
                userHasPermissions && (
                  <ErrorBoundary fallbackComponent={null}>
                    <ThreadComposer
                      activeCommunity={communitySlug}
                      showComposerUpsell={showComposerUpsell}
                    />
                  </ErrorBoundary>
                )}

              {(selectedView === 'threads' ||
                selectedView === 'trending-threads') && (
                <CommunityThreadFeed
                  viewContext="communityProfile"
                  slug={communitySlug}
                  id={community.id}
                  currentUser={isLoggedIn}
                  setThreadsStatus={
                    !this.showComposerUpsell && this.setComposerUpsell
                  }
                  isNewAndOwned={isNewAndOwned}
                  community={community}
                  pinnedThreadId={community.pinnedThreadId}
                  sort={
                    selectedView === 'trending-threads' ? 'trending' : 'latest'
                  }
                />
              )}

              {// members grid
              selectedView === 'members' && (
                <ErrorBoundary>
                  <CommunityMemberGrid
                    id={community.id}
                    filter={{ isMember: true, isBlocked: false }}
                  />
                </ErrorBoundary>
              )}

              {//search
              selectedView === 'search' && (
                <ErrorBoundary>
                  <Search community={community} />
                </ErrorBoundary>
              )}
            </Content>
            <Extras>
              <ErrorBoundary fallbackComponent={null}>
                <ColumnHeading>Channels</ColumnHeading>
                <ChannelList
                  id={community.id}
                  communitySlug={communitySlug.toLowerCase()}
                />
              </ErrorBoundary>

              <ErrorBoundary fallbackComponent={null}>
                <ColumnHeading>Team</ColumnHeading>
                <ModeratorList
                  id={community.id}
                  first={20}
                  filter={{ isModerator: true, isOwner: true }}
                />
              </ErrorBoundary>
            </Extras>
          </Grid>
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
            title={'Community not found'}
            provideBack={true}
            backRoute={'/'}
            noComposer
          />
          <ViewError
            heading={'We weren’t able to load this community.'}
            refresh
          />
        </AppViewWrapper>
      );
    }

    return (
      <AppViewWrapper>
        <Titlebar
          title={'Community not found'}
          provideBack={true}
          backRoute={'/'}
          noComposer
        />
        <ViewError
          heading={'We weren’t able to find this community.'}
          subheading={`If you want to start the ${communitySlug} community yourself, you can get started below.`}
        >
          <Upsell404Community />
        </ViewError>
      </AppViewWrapper>
    );
  }
}

export default compose(
  withCurrentUser,
  getCommunityByMatch,
  viewNetworkHandler,
  connect()
)(CommunityView);
