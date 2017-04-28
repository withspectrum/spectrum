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
import Loading from '../loading';
import InfiniteList from '../infiniteList';
import { Button } from '../buttons';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
);

const StoryFeedPure = ({ data: { stories, loading, fetchMore, error } }) => {
  if (error) {
    return <div>Oops, something went wrong</div>;
  }

  const renderStory = ({ index, key }) => {
    const node = stories[index].node;

    return <StoryFeedCard key={key} data={node} />;
  };

  return (
    <div>

      <InfiniteList
        height={window.innerHeight - 50}
        width={window.innerWidth > 768 ? 480 : window.innerWidth}
        elementCount={stories.length}
        elementRenderer={renderStory}
        keyMapper={index => stories[index].node.id}
      />

      {/* {stories.map(story => {
        return <StoryFeedCard key={story.node.id} data={story.node} />;
      })}

      <Button onClick={fetchMore}>Fetch More</Button> */}
    </div>
  );
};

const StoryFeed = compose(displayLoadingState, pure)(StoryFeedPure);
export default StoryFeed;
