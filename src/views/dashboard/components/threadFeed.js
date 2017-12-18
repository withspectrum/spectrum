import * as React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
// NOTE(@mxstbr): This is a custom fork published of off this (as of this writing) unmerged PR: https://github.com/CassetteRocks/react-infinite-scroller/pull/38
// I literally took it, renamed the package.json and published to add support for scrollElement since our scrollable container is further outside
import InfiniteList from 'react-infinite-scroller-with-scroll-element';
import { sortByDate } from '../../../helpers/utils';
import { LoadingInboxThread } from '../../../components/loading';
import { changeActiveThread } from '../../../actions/dashboardFeed';
import LoadingThreadFeed from './loadingThreadFeed';
import ErrorThreadFeed from './errorThreadFeed';
import EmptyThreadFeed from './emptyThreadFeed';
import EmptySearchFeed from './emptySearchFeed';
import InboxThread, { WatercoolerThread } from './inboxThread';
import viewNetworkHandler from '../../../components/viewNetworkHandler';

type Props = {
  mountedWithActiveThread: ?string,
  queryString?: ?string,
};

type State = {
  scrollElement: any,
  subscription: ?Function,
};

class ThreadFeed extends React.Component<Props, State> {
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

  unsubscribe = () => {
    const { subscription } = this.state;
    if (subscription) {
      // This unsubscribes the subscription
      return Promise.resolve(subscription());
    }
  };

  componentDidUpdate(prevProps) {
    const isDesktop = window.innerWidth > 768;
    const { scrollElement } = this.state;
    const { mountedWithActiveThread, isFetchingMore, queryString } = this.props;

    // user is searching, don't select anything
    if (queryString) {
      return;
    }

    // if the app loaded with a ?t query param, it means the user was linked to a thread from the inbox view and is already logged in. In this case we want to load the thread identified in the url and ignore the fact that a feed is loading in which auto-selects a different thread. If the user is on mobile, we should push them to the thread detail view
    if (this.props.data.threads && mountedWithActiveThread) {
      if (!isDesktop) {
        this.props.history.replace(`/?thread=${mountedWithActiveThread}`);
      }
      this.props.dispatch({ type: 'REMOVE_MOUNTED_THREAD_ID' });
      return;
    }

    if (
      // a thread has been selected
      ((!prevProps.selectedId && this.props.selectedId) ||
        prevProps.selectedId !== this.props.selectedId ||
        prevProps.activeCommunity !== this.props.activeCommunity) &&
      // elems exist
      this.innerScrollElement &&
      scrollElement &&
      // the threads height is less than the container scroll area
      this.innerScrollElement.offsetHeight < scrollElement.offsetHeight &&
      // the component isn't currently fetching more
      !isFetchingMore
    ) {
      this.props.data.hasNextPage && this.props.data.fetchMore();
      return;
    }

    // don't select a thread if the composer is open
    if (prevProps.selectedId === 'new') return;

    const hasThreadsButNoneSelected =
      this.props.data.threads && !this.props.selectedId;
    const justLoadedThreads =
      (!prevProps.data.threads && this.props.data.threads) ||
      (prevProps.data.loading && !this.props.data.loading);

    if (
      isDesktop &&
      (hasThreadsButNoneSelected || justLoadedThreads) &&
      this.props.data.threads.length > 0 &&
      !prevProps.isFetchingMore
    ) {
      if (
        (this.props.data.community &&
          this.props.data.community.watercooler &&
          this.props.data.community.watercooler.id) ||
        (this.props.data.community &&
          this.props.data.community.pinnedThread &&
          this.props.data.community.pinnedThread.id)
      ) {
        const selectId = this.props.data.community.watercooler
          ? this.props.data.community.watercooler.id
          : this.props.data.community.pinnedThread.id;

        this.props.history.replace(`/?t=${selectId}`);
        this.props.dispatch(changeActiveThread(selectId));
        return;
      }

      const threadNodes = this.props.data.threads
        .slice()
        .map(thread => thread.node);
      const sortedThreadNodes = sortByDate(threadNodes, 'lastActive', 'desc');
      const hasFirstThread = sortedThreadNodes.length > 0;
      const firstThreadId = hasFirstThread ? sortedThreadNodes[0].id : '';
      if (hasFirstThread) {
        this.props.history.replace(`/?t=${firstThreadId}`);
        this.props.dispatch(changeActiveThread(firstThreadId));
      }
    }

    // if the user changes the feed from all to a specific community, we need to reset the active thread in the inbox and reset our subscription for updates
    if (
      (!prevProps.data.feed && this.props.data.feed) ||
      (prevProps.data.feed && prevProps.data.feed !== this.props.data.feed)
    ) {
      const threadNodes = this.props.data.threads
        .slice()
        .map(thread => thread.node);
      const sortedThreadNodes = sortByDate(threadNodes, 'lastActive', 'desc');
      const hasFirstThread = sortedThreadNodes.length > 0;
      const firstThreadId = hasFirstThread ? sortedThreadNodes[0].id : '';
      if (hasFirstThread) {
        this.props.history.replace(`/?t=${firstThreadId}`);
        this.props.dispatch(changeActiveThread(firstThreadId));
      }

      if (scrollElement) {
        scrollElement.scrollTop = 0;
      }

      this.unsubscribe().then(() => this.subscribe());
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidMount() {
    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement: document.getElementById('scroller-for-inbox'),
    });
    this.subscribe();
  }

  render() {
    const {
      data: { threads, networkStatus },
      data,
      selectedId,
      activeCommunity,
      queryString,
    } = this.props;
    const { scrollElement } = this.state;

    // loading state
    if (networkStatus !== 7 && networkStatus !== 3)
      return <LoadingThreadFeed />;

    // error
    if (networkStatus === 8) return <ErrorThreadFeed />;

    // no threads yet
    if (threads.length === 0 && !queryString) return <EmptyThreadFeed />;

    if (threads.length === 0 && queryString)
      return <EmptySearchFeed queryString={queryString} />;

    const threadNodes = threads.slice().map(thread => thread.node);

    let sortedThreadNodes = sortByDate(threadNodes, 'lastActive', 'desc');
    if (activeCommunity) {
      sortedThreadNodes = sortedThreadNodes.filter(t => !t.watercooler);
    }

    let filteredThreads = sortedThreadNodes;
    if (
      this.props.data.community &&
      this.props.data.community.watercooler &&
      this.props.data.community.watercooler.id
    ) {
      filteredThreads = filteredThreads.filter(
        t => t.id !== this.props.data.community.watercooler.id
      );
    }

    if (
      this.props.data.community &&
      this.props.data.community.pinnedThread &&
      this.props.data.community.pinnedThread.id
    ) {
      filteredThreads = filteredThreads.filter(
        t => t.id !== this.props.data.community.pinnedThread.id
      );
    }

    return (
      <div
        data-e2e-id="inbox-thread-feed"
        ref={el => (this.innerScrollElement = el)}
      >
        {this.props.data.community &&
          this.props.data.community.watercooler &&
          this.props.data.community.watercooler.id && (
            <WatercoolerThread
              data={this.props.data.community.watercooler}
              active={selectedId === this.props.data.community.watercooler.id}
            />
          )}

        {this.props.data.community &&
          this.props.data.community.pinnedThread &&
          this.props.data.community.pinnedThread.id && (
            <InboxThread
              data={this.props.data.community.pinnedThread}
              active={selectedId === this.props.data.community.pinnedThread.id}
              hasActiveCommunity={this.props.hasActiveCommunity}
              hasActiveChannel={this.props.hasActiveChannel}
              pinnedThreadId={this.props.data.community.pinnedThread.id}
            />
          )}
        <InfiniteList
          pageStart={0}
          loadMore={this.props.data.fetchMore}
          hasMore={this.props.data.hasNextPage}
          loader={<LoadingInboxThread />}
          useWindow={false}
          initialLoad={false}
          scrollElement={scrollElement}
          threshold={750}
        >
          {filteredThreads.map(thread => {
            return (
              <InboxThread
                key={thread.id}
                data={thread}
                active={selectedId === thread.id}
                hasActiveCommunity={this.props.hasActiveCommunity}
                hasActiveChannel={this.props.hasActiveChannel}
              />
            );
          })}
        </InfiniteList>
      </div>
    );
  }
}
const map = state => ({
  mountedWithActiveThread: state.dashboardFeed.mountedWithActiveThread,
  activeCommunity: state.dashboardFeed.activeCommunity,
});
export default compose(withRouter, connect(map), viewNetworkHandler)(
  ThreadFeed
);
