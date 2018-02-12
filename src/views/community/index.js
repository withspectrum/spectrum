// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Link from '../../components/link';
import { Button } from '../../components/buttons';
import generateMetaInfo from 'shared/generate-meta-info';
import ThreadComposer from '../../components/threadComposer';
import Head from '../../components/head';
import Icon from '../../components/icons';
import AppViewWrapper from '../../components/appViewWrapper';
import ThreadFeed from '../../components/threadFeed';
import Search from './components/search';
import CommunityMemberGrid from './components/memberGrid';
import ToggleCommunityMembership from '../../components/toggleCommunityMembership';
import { addCommunityToOnboarding } from '../../actions/newUserOnboarding';
import { CoverPhoto } from '../../components/profile/coverPhoto';
import Titlebar from '../titlebar';
import { CommunityProfile } from '../../components/profile';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import type { ViewNetworkHandlerType } from '../../components/viewNetworkHandler';
import ViewError from '../../components/viewError';
import { LoadingScreen } from '../../components/loading';
import { Upsell404Community } from '../../components/upsell';
import {
  SegmentedControl,
  Segment,
  DesktopSegment,
  MobileSegment,
} from '../../components/segmentedControl';
import {
  LogoutButton,
  LoginButton,
  Grid,
  Meta,
  Content,
  Extras,
  MidSegment,
  ColumnHeading,
} from './style';
import getCommunityThreads from 'shared/graphql/queries/community/getCommunityThreadConnection';
import { getCommunityByMatch } from 'shared/graphql/queries/community/getCommunity';
import ChannelList from './components/channelList';
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

const CommunityAuthButton = ({ community, state, isLoggedIn }) => {
  if (
    !isLoggedIn ||
    (isLoggedIn &&
      !community.communityPermissions.isOwner &&
      !community.communityPermissions.isMember)
  ) {
    return (
      <ToggleCommunityMembership
        community={community}
        render={state => (
          <LoginButton loading={state.isLoading}>
            Join {community.name}
          </LoginButton>
        )}
      />
    );
  }

  if (
    isLoggedIn &&
    (!community.communityPermissions.isOwner &&
      community.communityPermissions.isMember)
  ) {
    return (
      <ToggleCommunityMembership
        community={community}
        render={state => (
          <LogoutButton icon={'checkmark'} loading={state.isLoading}>
            Member
          </LogoutButton>
        )}
      />
    );
  }

  return null;
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
      community.communityPermissions.isOwner && community.metaData.members < 5;
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

      const {
        showComposerUpsell,
        selectedView,
        isLeavingCommunity,
      } = this.state;
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
          <Grid>
            <CoverPhoto src={community.coverPhoto} />
            <Meta>
              <CommunityProfile data={{ community }} profileSize="full" />
              <CommunityAuthButton
                community={community}
                isLoggedIn={isLoggedIn}
              />
              {currentUser &&
                isOwner && (
                  <Link to={`/${community.slug}/settings`}>
                    <LogoutButton>Settings</LogoutButton>
                  </Link>
                )}
              <ChannelList
                id={community.id}
                communitySlug={communitySlug.toLowerCase()}
              />
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

                <Segment
                  segmentLabel="threads"
                  onClick={() => this.handleSegmentClick('threads')}
                  selected={selectedView === 'threads'}
                >
                  Threads
                </Segment>

                <MidSegment
                  segmentLabel="members"
                  onClick={() => this.handleSegmentClick('members')}
                  selected={selectedView === 'members'}
                >
                  Members ({community.metaData &&
                    community.metaData.members &&
                    community.metaData.members.toLocaleString()})
                </MidSegment>
                <MobileSegment
                  segmentLabel="members"
                  onClick={() => this.handleSegmentClick('members')}
                  selected={selectedView === 'members'}
                >
                  Members
                </MobileSegment>
                <MobileSegment
                  segmentLabel="search"
                  onClick={() => this.handleSegmentClick('search')}
                  selected={selectedView === 'search'}
                >
                  <Icon glyph={'search'} />
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
                <CommunityMemberGrid id={community.id} />
              )}

              {//search
              selectedView === 'search' && <Search community={community} />}
            </Content>
            <Extras>
              <ColumnHeading>Members</ColumnHeading>
              <CommunityMemberGrid id={community.id} />
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
