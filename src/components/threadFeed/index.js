// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import branch from 'recompose/branch';
import ThreadFeedCard from '../threadFeedCard';
import { LoadingCard } from '../loading';
import { Button } from '../buttons';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

/*
  The thread feed always expects a prop of 'threads' - this means that in
  the Apollo query contructor, you will need to map a new prop called 'threads'
  to return whatever threads we're fetching (community -> threadsConnection)

  See 'views/community/queries.js' for an example of the prop mapping in action
*/
const ThreadFeedPure = ({
  data: { threads, loading, fetchMore, error, hasNextPage },
  data,
}) => {
  if (error && threads.length > 0) {
    return <div>Oops, something went wrong</div>;
  }

  if (error && threads.length === 0) {
    return <div>No threads have been posted yet</div>;
  }

  if (threads.length === 0) {
    return <div>No threads have been posted yet</div>;
  }

  return (
    <div style={{ minWidth: '100%' }}>
      {threads.map(thread => {
        return <ThreadFeedCard key={thread.node.id} data={thread.node} />;
      })}

      {hasNextPage && <Button onClick={fetchMore}>Fetch More</Button>}
    </div>
  );
};

const ThreadFeed = compose(displayLoadingState, pure)(ThreadFeedPure);
export default ThreadFeed;
