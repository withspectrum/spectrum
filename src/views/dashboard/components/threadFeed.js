// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
// NOTE(@mxstbr): This is a custom fork published of off this (as of this writing) unmerged PR: https://github.com/CassetteRocks/react-infinite-scroller/pull/38
// I literally took it, renamed the package.json and published to add support for scrollElement since our scrollable container is further outside
import InfiniteList from 'src/components/infiniteScroll';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import FlipMove from 'react-flip-move';
import { sortByDate } from 'src/helpers/utils';
import { LoadingInboxThread } from 'src/components/loading';
import { changeActiveThread } from 'src/actions/dashboardFeed';
import LoadingThreadFeed from './loadingThreadFeed';
import ErrorThreadFeed from './errorThreadFeed';
import EmptyThreadFeed from './emptyThreadFeed';
import EmptySearchFeed from './emptySearchFeed';
import InboxThread from './inboxThread';
import DesktopAppUpsell from './desktopAppUpsell';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import type { ViewNetworkHandlerType } from 'src/components/viewNetworkHandler';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import type { GetCommunityThreadConnectionType } from 'shared/graphql/queries/community/getCommunityThreadConnection';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from 'src/components/error';
import { useConnectionRestored } from 'src/hooks/useConnectionRestored';
import type { WebsocketConnectionType } from 'src/reducers/connectionStatus';

type Node = {
  node: {
    ...$Exact<GetThreadType>,
  },
};

type Props = {
  mountedWithActiveThread: ?string,
  queryString?: ?string,
  ...$Exact<ViewNetworkHandlerType>,
  data: {
    subscribeToUpdatedThreads: ?Function,
    threads: Array<?Node>,
    fetchMore: Function,
    loading: boolean,
    community?: GetCommunityThreadConnectionType,
    networkStatus: number,
    hasNextPage: boolean,
    feed: string,
    refetch: Function,
  },
  history: Function,
  dispatch: Dispatch<Object>,
  selectedId: string,
  activeCommunity: ?string,
  activeChannel: ?string,
  hasActiveCommunity: boolean,
  networkOnline: boolean,
  websocketConnection: WebsocketConnectionType,
};

type State = {
  scrollElement: any,
  subscription: ?Function,
};

class ThreadFeed extends React.Component<Props, State> {
  innerScrollElement: any;

  constructor() {
    super();

    this.innerScrollElement = null;

    this.state = {
      scrollElement: null,
      subscription: null,
    };
  }

  subscribe = () => {
    this.setState({
      subscription:
        this.props.data.subscribeToUpdatedThreads &&
        this.props.data.subscribeToUpdatedThreads(),
    });
  };

  shouldComponentUpdate(nextProps) {
    const curr = this.props;
    if (curr.networkOnline !== nextProps.networkOnline) return true;
    if (curr.websocketConnection !== nextProps.websocketConnection) return true;
    // fetching more
    if (curr.data.networkStatus === 7 && nextProps.isFetchingMore) return false;
    return true;
  }

  unsubscribe = () => {
    const { subscription } = this.state;
    if (subscription) {
      // This unsubscribes the subscription
      return Promise.resolve(subscription());
    }
  };

  componentDidUpdate(prev) {
    const isDesktop = window.innerWidth > 768;
    const { scrollElement } = this.state;
    const curr = this.props;
    const { mountedWithActiveThread, queryString } = curr;

    const didReconnect = useConnectionRestored({ curr, prev });
    if (didReconnect && curr.data.refetch) {
      curr.data.refetch();
    }

    // user is searching, don't select anything
    if (queryString) {
      return;
    }

    // If we mount with ?t and are on mobile, we have to redirect to ?thread
    if (!isDesktop && mountedWithActiveThread) {
      curr.history.replace(`/?thread=${mountedWithActiveThread}`);
      curr.dispatch({ type: 'REMOVE_MOUNTED_THREAD_ID' });
      return;
    }

    const hasThreadsButNoneSelected = curr.data.threads && !curr.selectedId;
    const justLoadedThreads =
      !mountedWithActiveThread &&
      ((!prev.data.threads && curr.data.threads) ||
        (prev.data.loading && !curr.data.loading));

    // if the app loaded with a ?t query param, it means the user was linked to a thread from the inbox view and is already logged in. In this case we want to load the thread identified in the url and ignore the fact that a feed is loading in which auto-selects a different thread.
    if (justLoadedThreads && mountedWithActiveThread) {
      curr.dispatch({ type: 'REMOVE_MOUNTED_THREAD_ID' });
      return;
    }

    // don't select a thread if the composer is open
    if (prev.selectedId === 'new') {
      return;
    }

    if (
      isDesktop &&
      (hasThreadsButNoneSelected || justLoadedThreads) &&
      curr.data.threads.length > 0 &&
      !prev.isFetchingMore
    ) {
      if (
        (curr.data.community &&
          curr.data.community.watercooler &&
          curr.data.community.watercooler.id) ||
        (curr.data.community &&
          curr.data.community.pinnedThread &&
          curr.data.community.pinnedThread.id)
      ) {
        const selectId = curr.data.community.watercooler
          ? curr.data.community.watercooler.id
          : curr.data.community.pinnedThread.id;

        curr.history.replace(`/?t=${selectId}`);
        curr.dispatch(changeActiveThread(selectId));
        return;
      }

      const threadNodes = curr.data.threads
        .slice()
        .map(thread => thread && thread.node);
      const sortedThreadNodes = sortByDate(threadNodes, 'lastActive', 'desc');
      const hasFirstThread = sortedThreadNodes.length > 0;
      const firstThreadId = hasFirstThread ? sortedThreadNodes[0].id : '';
      if (hasFirstThread) {
        curr.history.replace(`/?t=${firstThreadId}`);
        curr.dispatch(changeActiveThread(firstThreadId));
      }
    }

    // if the user changes the feed from all to a specific community, we need to reset the active thread in the inbox and reset our subscription for updates
    if (
      (!prev.data.feed && curr.data.feed) ||
      (prev.data.feed && prev.data.feed !== curr.data.feed)
    ) {
      const threadNodes = curr.data.threads
        .slice()
        .map(thread => thread && thread.node);
      const sortedThreadNodes = sortByDate(threadNodes, 'lastActive', 'desc');
      const hasFirstThread = sortedThreadNodes.length > 0;
      const firstThreadId = hasFirstThread ? sortedThreadNodes[0].id : '';
      if (hasFirstThread) {
        curr.history.replace(`/?t=${firstThreadId}`);
        curr.dispatch(changeActiveThread(firstThreadId));
      }

      if (scrollElement) {
        scrollElement.scrollTop = 0;
      }

      // $FlowFixMe
      this.unsubscribe()
        .then(() => this.subscribe())
        .catch(err => console.error('Error unsubscribing: ', err));
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidMount() {
    const scrollElement = document.getElementById('scroller-for-inbox');

    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement,
    });

    this.subscribe();
  }

  render() {
    const {
      data: { threads, community },
      selectedId,
      activeCommunity,
      activeChannel,
      queryString,
      isLoading,
      hasError,
    } = this.props;
    const { scrollElement } = this.state;

    if (Array.isArray(threads)) {
      // API returned no threads
      if (threads.length === 0) {
        if (isLoading) {
          return <LoadingThreadFeed />;
        }
        if (queryString) {
          return <EmptySearchFeed queryString={queryString} />;
        } else {
          return <EmptyThreadFeed />;
        }
      }

      const threadNodes = threads.slice().map(thread => thread && thread.node);

      let sortedThreadNodes = sortByDate(threadNodes, 'lastActive', 'desc');

      if (activeCommunity) {
        sortedThreadNodes = sortedThreadNodes.filter(t => !t.watercooler);
      }

      // Filter the watercooler and pinned threads from the feed if we're on the community view
      // since they're automatically shown at the top
      let filteredThreads = sortedThreadNodes;
      if (community) {
        if (community.watercooler && community.watercooler.id) {
          filteredThreads = filteredThreads.filter(
            t => t.id !== community.watercooler.id
          );
        }
        if (community.pinnedThread && community.pinnedThread.id) {
          filteredThreads = filteredThreads.filter(
            t => t.id !== community.pinnedThread.id
          );
        }
      }

      const uniqueThreads = deduplicateChildren(filteredThreads, 'id');

      let viewContext;
      if (activeCommunity) viewContext = 'communityInbox';
      if (activeChannel) viewContext = 'channelInbox';

      return (
        <div
          data-cy="inbox-thread-feed"
          ref={el => (this.innerScrollElement = el)}
        >
          <DesktopAppUpsell />

          {community &&
            community.watercooler &&
            community.watercooler.id && (
              <ErrorBoundary fallbackComponent={null}>
                <InboxThread
                  data={community.watercooler}
                  active={selectedId === community.watercooler.id}
                  viewContext={viewContext}
                />
              </ErrorBoundary>
            )}

          {community &&
            community.pinnedThread &&
            community.pinnedThread.id && (
              <ErrorBoundary fallbackComponent={null}>
                <InboxThread
                  data={community.pinnedThread}
                  active={selectedId === community.pinnedThread.id}
                  viewContext={viewContext}
                />
              </ErrorBoundary>
            )}
          <InfiniteList
            pageStart={0}
            loadMore={this.props.data.fetchMore}
            isLoadingMore={this.props.isFetchingMore}
            hasMore={this.props.data.hasNextPage}
            loader={<LoadingInboxThread />}
            useWindow={false}
            initialLoad={false}
            scrollElement={scrollElement}
            threshold={750}
            className={'scroller-for-dashboard-threads'}
          >
            <FlipMove duration={350}>
              {uniqueThreads.map(thread => {
                return (
                  <ErrorBoundary fallbackComponent={null} key={thread.id}>
                    <InboxThread
                      data={thread}
                      active={selectedId === thread.id}
                      viewContext={viewContext}
                    />
                  </ErrorBoundary>
                );
              })}
            </FlipMove>
          </InfiniteList>
        </div>
      );
    }

    if (isLoading) return <LoadingThreadFeed />;

    if (hasError) return <ErrorThreadFeed />;

    return null;
  }
}
const map = state => ({
  mountedWithActiveThread: state.dashboardFeed.mountedWithActiveThread,
  activeCommunity: state.dashboardFeed.activeCommunity,
  activeChannel: state.dashboardFeed.activeChannel,
  networkOnline: state.connectionStatus.networkOnline,
  websocketConnection: state.connectionStatus.websocketConnection,
});
export default compose(
  withRouter,
  // $FlowIssue
  connect(map),
  viewNetworkHandler
)(ThreadFeed);
