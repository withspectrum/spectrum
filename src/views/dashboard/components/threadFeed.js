// @flow
import React, { Component } from 'react';
//$FlowFixMe
import styled from 'styled-components';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { withRouter } from 'react-router';
// NOTE(@mxstbr): This is a custom fork published of off this (as of this writing) unmerged PR: https://github.com/CassetteRocks/react-infinite-scroller/pull/38
// I literally took it, renamed the package.json and published to add support for scrollElement since our scrollable container is further outside
import InfiniteList from 'react-infinite-scroller-with-scroll-element';
import { connect } from 'react-redux';
import NewActivityIndicator from '../../../components/newActivityIndicator';
import { LoadingInboxThread } from '../../../components/loading';
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
      subscription();
    }
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.data.threads && this.props.data.threads) {
      const firstThreadId = this.props.data.threads[0].node.id;
      this.props.history.push({ search: `?t=${firstThreadId}` });
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
      newActivityIndicator,
      selectedId,
    } = this.props;
    const { scrollElement } = this.state;

    // loading state
    if (networkStatus !== 7) return <LoadingThreadFeed />;

    // error
    if (networkStatus === 8) return <ErrorThreadFeed />;

    // no threads yet
    if (threads.length === 0) return <EmptyThreadFeed />;

    const threadNodes = threads.slice().map(thread => thread.node);

    return (
      <div>
        {newActivityIndicator && <NewActivityIndicator />}
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
          {threadNodes.map(thread => {
            return (
              <InboxThread
                key={thread.id}
                data={thread}
                active={selectedId === thread.id}
              />
            );
          })}
        </InfiniteList>
      </div>
    );
  }
}

const map = state => ({
  newActivityIndicator: state.newActivityIndicator.hasNew,
});
export default compose(connect(map), withRouter, pure)(ThreadFeed);
