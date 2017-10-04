import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
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
import InboxThread from './inboxThread';

class ThreadFeed extends Component {
  state: {
    scrollElement: any,
    subscription: ?Function,
  };

  constructor() {
    super();
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
    const { scrollElement } = this.state;

    const hasThreadsButNoneSelected =
      this.props.data.threads && !this.props.selectedId;
    const justLoadedThreads =
      (!prevProps.data.threads && this.props.data.threads) ||
      (prevProps.data.loading && !this.props.data.loading);
    const isDesktop = window.innerWidth > 768;

    if (isDesktop && (hasThreadsButNoneSelected || justLoadedThreads)) {
      const threadNodes = this.props.data.threads
        .slice()
        .map(thread => thread.node);
      const sortedThreadNodes = sortByDate(threadNodes, 'lastActive', 'desc');
      const hasFirstThread = sortedThreadNodes.length > 0;
      const firstThreadId = hasFirstThread ? sortedThreadNodes[0].id : '';
      if (hasFirstThread) {
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
    const { data: { threads, networkStatus }, selectedId } = this.props;
    const { scrollElement } = this.state;

    // loading state
    if (networkStatus !== 7 && networkStatus !== 3)
      return <LoadingThreadFeed />;

    // error
    if (networkStatus === 8) return <ErrorThreadFeed />;

    // no threads yet
    if (threads.length === 0) return <EmptyThreadFeed />;

    const threadNodes = threads.slice().map(thread => thread.node);

    const sortedThreadNodes = sortByDate(threadNodes, 'lastActive', 'desc');

    return (
      <div>
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
          {sortedThreadNodes.map(thread => {
            return (
              <InboxThread
                key={thread.id}
                data={thread}
                active={selectedId === thread.id}
                hasActiveCommunity={this.props.hasActiveCommunity}
                pinnedThreadId={this.props.pinnedThreadId}
              />
            );
          })}
        </InfiniteList>
      </div>
    );
  }
}

export default compose(withRouter, connect(), pure)(ThreadFeed);
