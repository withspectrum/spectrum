// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';

import ThreadFeedCard from '../threadFeedCard';
import { NullCard } from '../upsell';
import { LoadingThread } from '../loading';
import { Button } from '../buttons';

// const displayLoadingState = branch(
//   props => props.data.loading,
//   renderComponent(LoadingThread)
// );

const NullState = () => (
  <NullCard
    bg="post"
    heading={`Sorry, no threads here yet...`}
    copy={`But you could start one!`}
  >
    <Button icon="post">Start a thread</Button>
  </NullCard>
);

const ErrorState = () => (
  <NullCard
    bg="error"
    heading={`Whoops!`}
    copy={`Something went wrong on our end... Mind reloading?`}
  >
    <Button icon="view-reload">Reload</Button>
  </NullCard>
);

/*
  The thread feed always expects a prop of 'threads' - this means that in
  the Apollo query contructor, you will need to map a new prop called 'threads'
  to return whatever threads we're fetching (community -> threadsConnection)

  See 'views/community/queries.js' for an example of the prop mapping in action
*/
const ThreadFeedPure = props => {
  const {
    data: { threads, loading, fetchMore, error, hasNextPage },
    currentUser,
  } = props;

  if (loading) {
    return (
      <div style={{ minWidth: '100%' }}>
        <LoadingThread />
        <LoadingThread />
        <LoadingThread />
        <LoadingThread />
        <LoadingThread />
        <LoadingThread />
      </div>
    );
  } else if ((error && threads.length > 0) || (error && threads.length === 0)) {
    return <ErrorState />;
  } else if (threads.length === 0 && currentUser) {
    return <NullState />;
  } else {
    return (
      <div style={{ minWidth: '100%' }}>
        {threads.map(thread => {
          return (
            <ThreadFeedCard
              key={thread.node.id}
              data={thread.node}
              viewContext={props.viewContext}
            />
          );
        })}

        {hasNextPage && <Button onClick={fetchMore}>Load more threads</Button>}
      </div>
    );
  }
};

const ThreadFeed = compose(pure)(ThreadFeedPure);

export default ThreadFeed;
