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
import StoryFeedCard from '../storyFeedCard';
import { LoadingCard } from '../loading';
import { Button } from '../buttons';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

/*
  The story feed always expects a prop of 'stories' - this means that in
  the Apollo query contructor, you will need to map a new prop called 'stories'
  to return whatever stories we're fetching (community -> storiesConnection)

  See 'views/community/queries.js' for an example of the prop mapping in action
*/
const StoryFeedPure = ({
  data: { stories, loading, fetchMore, error, hasNextPage },
  data,
}) => {
  if (error && stories.length > 0) {
    return <div>Oops, something went wrong</div>;
  }

  if (error && stories.length === 0) {
    return <div>No stories have been posted yet</div>;
  }

  if (stories.length === 0) {
    return <div>No stories have been posted yet</div>;
  }

  return (
    <div style={{ minWidth: '100%' }}>
      {stories.map(story => {
        return <StoryFeedCard key={story.node.id} data={story.node} />;
      })}

      {hasNextPage && <Button onClick={fetchMore}>Fetch More</Button>}
    </div>
  );
};

const StoryFeed = compose(displayLoadingState, pure)(StoryFeedPure);
export default StoryFeed;
