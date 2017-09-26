// @flow
import * as React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import generateMetaInfo from 'shared/generate-meta-info';
import { track } from '../../helpers/events';
import ThreadComposer from '../../components/threadComposer';
import Head from '../../components/head';
import Icon from '../../components/icons';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import ThreadFeed from '../../components/threadFeed';
import Search from './components/search';
import CommunityMemberGrid from './components/memberGrid';
import { toggleCommunityMembershipMutation } from '../../api/community';
import { addToastWithTimeout } from '../../actions/toasts';
import { addCommunityToOnboarding } from '../../actions/newUserOnboarding';
import { CoverPhoto } from '../../components/profile/coverPhoto';
import Titlebar from '../titlebar';
import { CommunityProfile } from '../../components/profile';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import ViewError from '../../components/viewError';
import { LoadingScreen } from '../../components/loading';
import {
  UpsellSignIn,
  UpsellJoinCommunity,
  Upsell404Community,
} from '../../components/upsell';
import {
  CoverRow,
  CoverColumn,
  SegmentedControl,
  Segment,
  LogoutButton,
} from './style';
import { getCommunityThreads } from './queries';
import { getCommunity } from '../../api/community';
import ChannelList from './components/channelList';
const CommunityThreadFeed = compose(connect(), getCommunityThreads)(ThreadFeed);

type Props = {
  dispatch: Function,
  toggleCommunityMembership: Function,
  isLoading: boolean,
  hasError: boolean,
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
  isLoading: boolean,
  showComposerUpsell: boolean,
  selectedView: 'threads' | 'search' | 'members',
};

class CommunityView extends React.Component<Props, State> {
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

  toggleMembership = (communityId: string) => {
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

    if (community) {
      // at this point the community exists and was fetched
      const { title, description } = generateMetaInfo({
        type: 'community',
        data: {
          name: community.name,
          description: community.description,
        },
      });
      const { showComposerUpsell, selectedView } = this.state;
      const { isMember, isOwner, isModerator } = community.communityPermissions;
      const userHasPermissions = isMember || isOwner || isModerator;
      const isLoggedIn = currentUser;
      const isMobile = window.innerWidth < 768;

      // if the user is new and signed up through a community page, push
      // the community data into the store to hydrate the new user experience
      // with their first community they should join
      this.props.dispatch(addCommunityToOnboarding(community));

      // if the person viewing the community recently created this community,
      // we'll mark it as "new and owned" - this tells the downstream
      // components to show nux upsells to create a thread or invite people
      // to the community
      const isNewAndOwned = isOwner && community.metaData.members < 5;

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
                  (!isMobile &&
                    !community.communityPermissions.isOwner &&
                    community.communityPermissions.isMember) && (
                    <LogoutButton
                      onClick={() => this.toggleMembership(community.id)}
                    >
                      Leave {community.name}
                    </LogoutButton>
                  )}
                {!isMobile && (
                  <ChannelList communitySlug={communitySlug.toLowerCase()} />
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
                  userHasPermissions && (
                    <ThreadComposer
                      activeCommunity={communitySlug}
                      showComposerUpsell={showComposerUpsell}
                    />
                  )}

                {// if the user is logged in but doesn't own the community
                // or isn't a member yet, prompt them to join the community
                isLoggedIn &&
                  !userHasPermissions && (
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
                    <UpsellSignIn
                      view={{ data: community, type: 'community' }}
                    />
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

    if (isLoading) {
      return <LoadingScreen />;
    }

    if (hasError) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={`Community not found`}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <ViewError
            heading={`We weren’t able to load this community.`}
            refresh
          />
        </AppViewWrapper>
      );
    }

    return (
      <AppViewWrapper>
        <Titlebar
          title={`Community not found`}
          provideBack={true}
          backRoute={`/`}
          noComposer
        />
        <ViewError
          heading={`We weren’t able to find this community.`}
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
  connect(map),
  toggleCommunityMembershipMutation,
  getCommunity,
  viewNetworkHandler,
  pure
)(CommunityView);
