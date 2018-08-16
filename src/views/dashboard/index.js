// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import generateMetaInfo from 'shared/generate-meta-info';
import { connect } from 'react-redux';
import { removeItemFromStorage } from '../../helpers/localStorage';
import getEverythingThreads from 'shared/graphql/queries/user/getCurrentUserEverythingFeed';
import getCommunityThreads from 'shared/graphql/queries/community/getCommunityThreadConnection';
import getChannelThreadConnection from 'shared/graphql/queries/channel/getChannelThreadConnection';
import { getCurrentUserCommunityConnection } from 'shared/graphql/queries/user/getUserCommunityConnection';
import type { GetUserCommunityConnectionType } from 'shared/graphql/queries/user/getUserCommunityConnection';
import searchThreadsQuery from 'shared/graphql/queries/search/searchThreads';
import Titlebar from '../../views/titlebar';
import NewUserOnboarding from '../../views/newUserOnboarding';
import DashboardThreadFeed from './components/threadFeed';
import Head from '../../components/head';
import Menu from '../../components/menu';
import DashboardLoading from './components/dashboardLoading';
import DashboardError from './components/dashboardError';
import NewActivityIndicator from './components/newActivityIndicator';
import DashboardThread from '../dashboardThread';
import Header from './components/threadSelectorHeader';
import CommunityList from './components/communityList';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import {
  DashboardWrapper,
  InboxWrapper,
  InboxScroller,
  FeedHeaderContainer,
  ThreadWrapper,
  ThreadScroller,
  SearchStringHeader,
  Sidebar,
} from './style';
import { track, events } from 'src/helpers/analytics';
import { ErrorBoundary } from 'src/components/error';

const EverythingThreadFeed = compose(connect(), getEverythingThreads)(
  DashboardThreadFeed
);

const CommunityThreadFeed = compose(connect(), getCommunityThreads)(
  DashboardThreadFeed
);

const ChannelThreadFeed = compose(connect(), getChannelThreadConnection)(
  DashboardThreadFeed
);

const SearchThreadFeed = compose(connect(), searchThreadsQuery)(
  DashboardThreadFeed
);

type State = {
  activeChannelObject: ?Object,
};

type Props = {
  data: {
    user?: GetUserCommunityConnectionType,
  },
  newActivityIndicator: boolean,
  activeThread: ?string,
  activeCommunity: ?string,
  activeChannel: ?string,
  isLoading: boolean,
  hasError: boolean,
  searchQueryString: ?string,
};

class Dashboard extends React.Component<Props, State> {
  state = {
    activeChannelObject: null,
  };

  setActiveChannelObject = (channel: Object) => {
    this.setState({
      activeChannelObject: channel,
    });
  };

  componentDidMount() {
    track(events.INBOX_EVERYTHING_VIEWED);
  }

  render() {
    const {
      data: { user },
      newActivityIndicator,
      activeThread,
      activeCommunity,
      activeChannel,
      isLoading,
      hasError,
      searchQueryString,
    } = this.props;
    const { activeChannelObject } = this.state;

    const searchFilter = {
      everythingFeed: false,
      creatorId: null,
      channelId: activeChannel || null,
      communityId: activeChannel ? null : activeCommunity || null,
    };
    const { title, description } = generateMetaInfo();

    if (user) {
      // if the user has set a username but hasn't joined any communities yet, we have nothing to show them on the dashboard. So instead just render the onboarding step to upsell popular communities to join
      if (user.username && user.communityConnection.edges.length === 0) {
        return (
          <NewUserOnboarding
            noCloseButton
            close={() => {}}
            currentUser={user}
          />
        );
      }

      // at this point we have succesfully validated a user, and the user has both a username and joined communities - we can show their thread feed!
      const communities = user.communityConnection.edges
        .filter(Boolean)
        .map(({ node: community }) => community);
      const activeCommunityObject = communities.find(
        c => c && c.id === activeCommunity
      );

      return (
        <DashboardWrapper data-cy="inbox-view" id="main">
          <Head title={title} description={description} />
          <Titlebar hasChildren hasSearch filter={searchFilter}>
            <Menu darkContext hasTabBar>
              <ErrorBoundary>
                <CommunityList
                  communities={communities}
                  user={user}
                  activeCommunity={activeCommunity}
                  activeChannel={activeChannel}
                />
              </ErrorBoundary>
            </Menu>
          </Titlebar>
          <Sidebar>
            <ErrorBoundary>
              <CommunityList
                communities={communities}
                user={user}
                activeCommunity={activeCommunity}
                activeChannel={activeChannel}
                setActiveChannelObject={this.setActiveChannelObject}
              />
            </ErrorBoundary>
          </Sidebar>
          <InboxWrapper>
            <FeedHeaderContainer>
              <ErrorBoundary>
                <Header
                  filter={searchFilter}
                  communities={communities}
                  user={user}
                  activeCommunity={activeCommunity}
                  activeCommunityObject={activeCommunityObject}
                  activeChannel={activeChannel}
                  activeChannelObject={activeChannelObject}
                />
              </ErrorBoundary>
            </FeedHeaderContainer>
            {newActivityIndicator && (
              <NewActivityIndicator elem="scroller-for-inbox" />
            )}
            {searchQueryString &&
              searchQueryString.length > 0 && (
                <SearchStringHeader>
                  Search results for “{searchQueryString}”
                </SearchStringHeader>
              )}
            <InboxScroller id="scroller-for-inbox">
              {searchQueryString &&
                searchQueryString.length > 0 &&
                searchFilter && (
                  <ErrorBoundary>
                    <SearchThreadFeed
                      queryString={searchQueryString}
                      filter={searchFilter}
                      selectedId={activeThread}
                    />
                  </ErrorBoundary>
                )}

              {// no community, no search results
              !activeCommunity &&
                !searchQueryString && (
                  <ErrorBoundary>
                    <EverythingThreadFeed selectedId={activeThread} />
                  </ErrorBoundary>
                )}

              {// community, no channel, no search results
              activeCommunity &&
                !activeChannel &&
                !searchQueryString && (
                  <ErrorBoundary>
                    <CommunityThreadFeed
                      id={activeCommunity}
                      selectedId={activeThread}
                      hasActiveCommunity={activeCommunity}
                      community={activeCommunityObject}
                      pinnedThreadId={
                        activeCommunityObject &&
                        activeCommunityObject.pinnedThreadId
                      }
                    />
                  </ErrorBoundary>
                )}

              {// channel and community, no search results
              activeChannel &&
                activeCommunity &&
                !searchQueryString && (
                  <ErrorBoundary>
                    <ChannelThreadFeed
                      id={activeChannel}
                      selectedId={activeThread}
                      hasActiveCommunity={activeCommunity}
                      hasActiveChannel={activeChannel}
                      community={activeCommunityObject}
                      pinnedThreadId={
                        activeCommunityObject &&
                        activeCommunityObject.pinnedThreadId
                      }
                      channelId={activeChannel}
                    />
                  </ErrorBoundary>
                )}
            </InboxScroller>
          </InboxWrapper>

          <ThreadWrapper>
            <ThreadScroller id="scroller-for-inbox-thread-view">
              <ErrorBoundary>
                <DashboardThread
                  threadId={activeThread}
                  activeCommunity={
                    activeCommunityObject && activeCommunityObject.slug
                  }
                  activeChannel={activeChannel}
                />
              </ErrorBoundary>
            </ThreadScroller>
          </ThreadWrapper>
        </DashboardWrapper>
      );
    }

    // loading state
    if (isLoading)
      return <DashboardLoading title={title} description={description} />;

    if (hasError)
      return (
        <DashboardError
          title={title}
          description={description}
          error={hasError}
        />
      );

    // if the user reached here it most likely that they have a user in localstorage but we weren't able to auth them - either because of a bad session token or otherwise. In this case we should clear local storage and load the home page to get them to log in again
    removeItemFromStorage('spectrum');
    window.location.href = '/';
    return null;
  }
}

const map = state => ({
  newActivityIndicator: state.newActivityIndicator.hasNew,
  activeThread: state.dashboardFeed.activeThread,
  activeCommunity: state.dashboardFeed.activeCommunity,
  activeChannel: state.dashboardFeed.activeChannel,
  searchQueryString: state.dashboardFeed.search.queryString,
});
export default compose(
  // $FlowIssue
  connect(map),
  getCurrentUserCommunityConnection,
  viewNetworkHandler
)(Dashboard);
