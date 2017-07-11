// @flow
import React, { Component } from 'react';
//$FlowFixMe
import styled from 'styled-components';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// NOTE(@mxstbr): This is a custom fork published of off this (as of this writing) unmerged PR: https://github.com/CassetteRocks/react-infinite-scroller/pull/38
// I literally took it, renamed the package.json and published to add support for scrollElement since our scrollable container is further outside
import InfiniteList from 'react-infinite-scroller-with-scroll-element';

import ThreadFeedCard from '../threadFeedCard';
import { NullCard } from '../upsell';
import { LoadingThread } from '../loading';
import { Button } from '../buttons';
import { FetchMoreButton } from './style';

const NullState = () =>
  <NullCard
    bg="post"
    heading={`Sorry, no threads here yet...`}
    copy={`But you could start one!`}
  />;

const ErrorState = () =>
  <NullCard
    bg="error"
    heading={`Whoops!`}
    copy={`Something went wrong on our end... Mind reloading?`}
  >
    <Button icon="view-reload" onClick={() => window.location.reload(true)}>
      Reload
    </Button>
  </NullCard>;

const Threads = styled.div`
  min-width: 100%;

  button {
    align-self: center;
    margin: auto;
  }

  @media (max-width: 768px) {
  }
`;

/*
  The thread feed always expects a prop of 'threads' - this means that in
  the Apollo query contructor, you will need to map a new prop called 'threads'
  to return whatever threads we're fetching (community -> threadsConnection)

  See 'views/community/queries.js' for an example of the prop mapping in action
*/
class ThreadFeedPure extends Component {
  constructor() {
    super();
    this.state = {
      scrollElement: null,
    };
  }

  componentDidMount() {
    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement: document.getElementById('scroller-for-thread-feed'),
    });
  }

  render() {
    const {
      data: { threads, loading, user, error, hasNextPage, networkStatus },
      data,
      currentUser,
      viewContext,
    } = this.props;
    const { scrollElement } = this.state;
    const dataExists = threads && threads.length;
    const loggedInUser = user || currentUser;

    if (networkStatus === 7) {
      if (threads.length === 0) {
        return <NullState />;
      } else {
        return (
          <Threads>
            <InfiniteList
              pageStart={0}
              loadMore={this.props.data.fetchMore}
              hasMore={this.props.data.hasNextPage}
              loader={<LoadingThread />}
              useWindow={false}
              initialLoad={false}
              scrollElement={scrollElement}
              threshold={750}
            >
              {threads.map(thread => {
                return (
                  <ThreadFeedCard
                    key={thread.node.id}
                    data={thread.node}
                    viewContext={viewContext}
                  />
                );
              })}
            </InfiniteList>
          </Threads>
        );
      }
    } else if (networkStatus === 8) {
      return <ErrorState />;
    } else {
      return (
        <Threads>
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
        </Threads>
      );
    }
  }
}

const ThreadFeed = compose(pure)(ThreadFeedPure);

export default ThreadFeed;
