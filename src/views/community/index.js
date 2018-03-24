// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Link from 'src/components/link';
import { Button } from 'src/components/buttons';
import generateMetaInfo from 'shared/generate-meta-info';
import ThreadComposer from 'src/components/threadComposer';
import Head from 'src/components/head';
import Icon from 'src/components/icons';
import AppViewWrapper from 'src/components/appViewWrapper';
import ThreadFeed from 'src/components/threadFeed';
import Search from 'src/components/search/communityThreads';
import CommunityMemberGrid from './components/memberGrid';
import ToggleCommunityMembership from 'src/components/toggleMembership/community';
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
import {
  SegmentedControl,
  DesktopSegment,
  MidSegment,
  MobileSegment,
} from 'src/components/segmentedControl';
import {
  Grid,
  Meta,
  Content,
  Extras,
  ColumnHeading,
} from 'src/components/profileLayout';
import { ProfileCTA } from 'src/components/profile/style';
import getCommunityThreads from 'shared/graphql/queries/community/getCommunityThreadConnection';
import { getCommunityByMatch } from 'shared/graphql/queries/community/getCommunity';
import ChannelList from './components/channelList';
import ModeratorList from './components/moderatorList';

const CommunityThreadFeed = compose(connect(), getCommunityThreads)(ThreadFeed);

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  dispatch: Function,
  toggleCommunityMembership: Function,
  currentUser: Object,
  match: {
    params: {
      communitySlug: string,
    },
  },
  data: {
    community: Object,
  },
};

type State = {
  showComposerUpsell: boolean,
  selectedView: 'threads' | 'search' | 'members',
  isLeavingCommunity: boolean,
};

class CommunityView extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      isLeavingCommunity: false,
      showComposerUpsell: false,
      selectedView: 'threads',
    };
  }

  componentDidUpdate(prevProps) {
    // if the user is new and signed up through a community page, push
    // the community data into the store to hydrate the new user experience
    // with their first community they should join
    if (this.props.currentUser) return;
    if (
      (!prevProps.data.community && this.props.data.community) ||
      (prevProps.data.community &&
        prevProps.data.community.id !== this.props.data.community.id)
    ) {
      this.props.dispatch(addCommunityToOnboarding(this.props.data.community));
    }
  }

  setComposerUpsell = () => {
    const { data: { community } } = this.props;
    const communityExists = community && community.communityPermissions;
    if (!communityExists) return;

    const isNewAndOwned =
      community.communityPermissions.isOwner && community.metaData.members < 2;
    return this.setState({ showComposerUpsell: isNewAndOwned ? true : false });
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
        isBlocked,
      } = community.communityPermissions;
      const userHasPermissions = isMember || isOwner || isModerator;
      const isLoggedIn = currentUser;

      if (isBlocked) {
        return (
          <AppViewWrapper data-e2e-id="community-view">
            <Titlebar
              title={community.name}
              provideBack={true}
              backRoute={'/'}
              noComposer={!community.communityPermissions.isMember}
            />

            <Head
              title={title}
              description={description}
              image={community.profilePhoto}
            />

            <ViewError
              emoji={'✋'}
              heading={`You are blocked from ${community.name}`}
              subheading={
                'You have been blocked from joining and viewing conversations in this community.'
              }
            >
              <Link to={'/'}>
                <Button large>Take me home</Button>
              </Link>
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
        <AppViewWrapper data-e2e-id="community-view">
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
          />
          <Grid>
            <CoverPhoto src={community.coverPhoto} />
            <Meta>
              <CommunityProfile data={{ community }} profileSize="full" />

              {!isLoggedIn ? (
                <Link to={loginUrl}>
                  <ProfileCTA isMember={false}>
                    Join {community.name}
                  </ProfileCTA>
                </Link>
              ) : !isOwner ? (
                <ToggleCommunityMembership
                  community={community}
                  render={state => (
                    <ProfileCTA
                      isMember={isMember}
                      gradientTheme={isMember ? null : 'success'}
                      color={isMember ? 'text.alt' : null}
                      icon={isMember ? 'checkmark' : null}
                      loading={state.isLoading}
                    >
                      {isMember ? 'Member' : `Join ${community.name}`}
                    </ProfileCTA>
                  )}
                />
              ) : null}

              {currentUser &&
                isOwner && (
                  <Link to={`/${community.slug}/settings`}>
                    <ProfileCTA icon={'settings'} isMember>
                      Settings
                    </ProfileCTA>
                  </Link>
                )}
            </Meta>
            <Content>
              <SegmentedControl style={{ margin: '16px 0 0 0' }}>
                <DesktopSegment
                  segmentLabel="search"
                  onClick={() => this.handleSegmentClick('search')}
                  selected={selectedView === 'search'}
                >
                  <Icon glyph={'search'} />
                  Search
                </DesktopSegment>

                <DesktopSegment
                  segmentLabel="threads"
                  onClick={() => this.handleSegmentClick('threads')}
                  selected={selectedView === 'threads'}
                >
                  Threads

                </DesktopSegment>
                <DesktopSegment
                  segmentLabel="members"
                  onClick={() => this.handleSegmentClick('members')}
                  selected={selectedView === 'members'}
                >
                  Members ({community.metaData &&
                    community.metaData.members &&
                    community.metaData.members.toLocaleString()})
                </DesktopSegment>
                <MobileSegment
                  segmentLabel="members"
                  onClick={() => this.handleSegmentClick('members')}
                  selected={selectedView === 'members'}
                >
                  <Icon glyph={'person'} />
                  {selectedView === 'members' && 'Members'}
                </MobileSegment>
                <MobileSegment
                  segmentLabel="search"
                  onClick={() => this.handleSegmentClick('search')}
                  selected={selectedView === 'search'}
                >
                  <Icon glyph={'search'} />
                  {selectedView === 'search' && 'Search'}
                </MobileSegment>
              </SegmentedControl>

              {// if the user is logged in, is viewing the threads,
              // and is a member of the community, they should see a
              // new thread composer
              isLoggedIn &&
                selectedView === 'threads' &&
                userHasPermissions && (
                  <ThreadComposer
                    activeCommunity={communitySlug}
                    showComposerUpsell={showComposerUpsell}
                  />
                )}

              {// thread list
              selectedView === 'threads' && (
                <CommunityThreadFeed
                  viewContext="community"
                  slug={communitySlug}
                  id={community.id}
                  currentUser={isLoggedIn}
                  setThreadsStatus={
                    !this.showComposerUpsell && this.setComposerUpsell
                  }
                  isNewAndOwned={isNewAndOwned}
                  community={community}
                  pinnedThreadId={community.pinnedThreadId}
                />
              )}

              {// members grid
              selectedView === 'members' && (
                <CommunityMemberGrid
                  id={community.id}
                  filter={{ isMember: true, isBlocked: false }}
                />
              )}

              {//search
              selectedView === 'search' && <Search community={community} />}
            </Content>
            <Extras>
              <ColumnHeading>Team</ColumnHeading>
              <ModeratorList
                id={community.id}
                first={20}
                filter={{ isModerator: true, isOwner: true }}
              />

              <ColumnHeading>Channels</ColumnHeading>
              <ChannelList
                id={community.id}
                communitySlug={communitySlug.toLowerCase()}
              />
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

const map = state => ({
  currentUser: state.users.currentUser,
});

export default compose(
  // $FlowIssue
  connect(map),
  getCommunityByMatch,
  viewNetworkHandler
)(CommunityView);
