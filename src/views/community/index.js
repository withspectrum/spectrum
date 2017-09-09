// @flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { track } from '../../helpers/events';
import ThreadComposer from '../../components/threadComposer';
import Head from '../../components/head';
import Icon from '../../components/icons';
import generateMetaInfo from 'shared/generate-meta-info';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
// import { Button } from '../../components/buttons';
import ThreadFeed from '../../components/threadFeed';
import ListCard from './components/listCard';
import Search from './components/search';
import MemberGrid from './components/memberGrid';
import { toggleCommunityMembershipMutation } from '../../api/community';
import { addToastWithTimeout } from '../../actions/toasts';
import { addCommunityToOnboarding } from '../../actions/newUserOnboarding';
import { CoverPhoto } from '../../components/profile/coverPhoto';
import Titlebar from '../titlebar';
import { CommunityProfile } from '../../components/profile';
import {
  LoadingProfile,
  LoadingList,
  LoadingComposer,
  LoadingFeed,
  displayLoadingCard,
} from '../../components/loading';
import {
  UpsellSignIn,
  UpsellJoinCommunity,
  Upsell404Community,
} from '../../components/upsell';
import {
  CoverRow,
  CoverColumn,
  CoverButton,
  SegmentedControl,
  Segment,
  LogoutButton,
} from './style';
import { getCommunityThreads, getCommunityChannels } from './queries';
import { getCommunity, getCommunityMembersQuery } from '../../api/community';

const CommunityMemberGrid = compose(getCommunityMembersQuery)(MemberGrid);
const CommunityThreadFeed = compose(getCommunityThreads)(ThreadFeed);
const ChannelListCard = compose(getCommunityChannels, displayLoadingCard)(
  ListCard
);

class CommunityViewPure extends Component {
  state: {
    isLoading: boolean,
    showComposerUpsell: boolean,
    selectedView: string,
  };

  constructor() {
    super();

    this.state = {
      isLoading: false,
      showComposerUpsell: false,
      selectedView: 'threads',
    };
  }

  componentDidMount() {
    track('community', 'viewed', null);
  }

  toggleMembership = communityId => {
    const { toggleCommunityMembership, dispatch } = this.props;

    this.setState({
      isLoading: true,
    });

    toggleCommunityMembership({ communityId })
      .then(({ data: { toggleCommunityMembership } }) => {
        const isMember =
          toggleCommunityMembership.communityPermissions.isMember;

        track('community', isMember ? 'joined' : 'unjoined', null);

        const str = isMember
          ? `Joined ${toggleCommunityMembership.name}!`
          : `Left ${toggleCommunityMembership.name}.`;

        const type = isMember ? 'success' : 'neutral';
        dispatch(addToastWithTimeout(type, str));

        this.setState({
          isLoading: false,
        });
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });

        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  setComposerUpsell = () => {
    const { data: { community } } = this.props;
    const communityExists =
      community && !community.deleted && community.communityPermissions;
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
      match,
      data: { community, user, networkStatus },
      currentUser,
      history,
    } = this.props;
    const { isLoading, showComposerUpsell, selectedView } = this.state;
    const communitySlug = match.params.communitySlug;
    const communityExists =
      community && !community.deleted && community.communityPermissions;
    const isOwnerOrMember =
      communityExists &&
      (community.communityPermissions.isMember ||
        community.communityPermissions.isOwner);
    const isLoggedIn = user || currentUser;
    // if the network request is not done, show a loading state
    const isMobile = window.innerWidth < 768;

    // error state
    if (networkStatus === 8) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={`Community Not Found`}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <Column type="primary">
            <Upsell404Community community={communitySlug} />;
          </Column>
        </AppViewWrapper>
      );
    }

    // community exists
    if (communityExists) {
      const { title, description } = generateMetaInfo({
        type: 'community',
        data: {
          name: community.name,
          description: community.description,
        },
      });

      // if the user is new and signed up through a community page, push
      // the community data into the store to hydrate the new user experience
      // with their first community they should join
      this.props.dispatch(addCommunityToOnboarding(community));

      // if the person viewing the community recently created this community,
      // we'll mark it as "new and owned" - this tells the downstream
      // components to show nux upsells to create a thread or invite people
      // to the community
      const isNewAndOwned =
        community.communityPermissions.isOwner &&
        community.metaData.members < 5;

      return (
        <AppViewWrapper>
          <Titlebar
            title={community.name}
            provideBack={true}
            backRoute={`/`}
            noComposer={!community.communityPermissions.isMember}
          />

          <Head title={title} description={description} />

          <CoverColumn>
            <CoverPhoto src={community.coverPhoto} />
            <CoverRow className={'flexy'}>
              <Column type="secondary" className={'inset'}>
                <CommunityProfile data={{ community }} profileSize="full" />
                {isLoggedIn &&
                (!community.communityPermissions.isOwner &&
                  community.communityPermissions.isMember) && (
                  <LogoutButton
                    onClick={() => this.toggleMembership(community.id)}
                  >
                    Leave {community.name}
                  </LogoutButton>
                )}
                {!isMobile && (
                  <ChannelListCard
                    slug={communitySlug.toLowerCase()}
                    currentUser={isLoggedIn}
                  />
                )}
              </Column>

              <Column type="primary">
                <SegmentedControl>
                  <Segment
                    segmentLabel="search"
                    onClick={() => this.handleSegmentClick('search')}
                    selected={selectedView === 'search'}
                  >
                    <Icon glyph={'search'} />
                    Search
                  </Segment>

                  <Segment
                    segmentLabel="threads"
                    onClick={() => this.handleSegmentClick('threads')}
                    selected={selectedView === 'threads'}
                  >
                    Threads
                  </Segment>

                  <Segment
                    segmentLabel="members"
                    onClick={() => this.handleSegmentClick('members')}
                    selected={selectedView === 'members'}
                  >
                    Members ({community.metaData.members.toLocaleString()})
                  </Segment>
                </SegmentedControl>

                {// if the user is logged in, is viewing the threads,
                // and is a member of the community, they should see a
                // new thread composer
                isLoggedIn &&
                selectedView === 'threads' &&
                isOwnerOrMember && (
                  <ThreadComposer
                    activeCommunity={communitySlug}
                    showComposerUpsell={showComposerUpsell}
                  />
                )}

                {// if the user is logged in but doesn't own the community
                // or isn't a member yet, prompt them to join the community
                isLoggedIn &&
                !isOwnerOrMember && (
                  <UpsellJoinCommunity
                    community={community}
                    loading={isLoading}
                    join={this.toggleMembership}
                  />
                )}

                {// if the user hasn't signed up yet, show them a spectrum
                // upsell signup prompt
                !isLoggedIn &&
                selectedView === 'threads' && (
                  <UpsellSignIn view={{ data: community, type: 'community' }} />
                )}

                {// thread list
                selectedView === 'threads' && (
                  <CommunityThreadFeed
                    viewContext="community"
                    slug={communitySlug}
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
              </Column>
            </CoverRow>
          </CoverColumn>
        </AppViewWrapper>
      );
    }

    // if the network request is done, but we don't have any data for the community
    // we can assume the community doesn't exist - in this case, show a prompt
    // to create a new community with this name
    if (networkStatus === 7) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={'Community Not Found'}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <Column type="primary">
            <Upsell404Community
              community={communitySlug}
              create={() => history.push('/new/community')}
            />
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

export const CommunityView = compose(
  toggleCommunityMembershipMutation,
  getCommunity,
  pure
)(CommunityViewPure);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(CommunityView);
