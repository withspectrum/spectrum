// @flow
import React, { Component } from 'react';
//$FlowFixMe
import styled from 'styled-components';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';

import ThreadFeedCard from '../threadFeedCard';
import { NullCard } from '../upsell';
import { LoadingThread } from '../loading';
import { Button } from '../buttons';
import { FetchMoreButton } from './style';

const NullState = () => (
  <NullCard
    bg="post"
    heading={`Sorry, no threads here yet...`}
    copy={`But you could start one!`}
  />
);

const ErrorState = () => (
  <NullCard
    bg="error"
    heading={`Whoops!`}
    copy={`Something went wrong on our end... Mind reloading?`}
  >
    <Button icon="view-reload" onClick={() => window.location.reload(true)}>
      Reload
    </Button>
  </NullCard>
);

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
  state: {
    isFetching: boolean,
  };

  constructor() {
    super();

    this.state = {
      isFetching: false,
    };
  }

  fetchMore = () => {
    this.setState({
      isFetching: true,
    });

    this.props.data.fetchMore();
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        isFetching: false,
      });
    }
  }

  render() {
    const {
      data: { threads, loading, error, hasNextPage },
      currentUser,
      viewContext,
    } = this.props;

    if (loading) {
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
    } else if (error) {
      return <ErrorState />;
    } else if (threads.length === 0 && currentUser) {
      return <NullState />;
    } else {
      return (
        <Threads>
          {threads.map(thread => {
            return (
              <ThreadFeedCard
                key={thread.node.id}
                data={thread.node}
                viewContext={viewContext}
              />
            );
          })}

          {hasNextPage &&
            <FetchMoreButton
              color={'brand.default'}
              loading={this.state.isFetching}
              onClick={this.fetchMore}
            >
              Load more threads
            </FetchMoreButton>}
        </Threads>
      );
    }
  }
}

const ThreadFeed = compose(pure)(ThreadFeedPure);

export default ThreadFeed;
