//@flow
import React from 'react';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
import { StoryDetail } from '../components/storyDetail';
import { getStory } from '../queries';
import Loading from '../../../components/loading';

// TODO: Brian - figure out how to abstract this out to be used anywhere
const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
);

const StoryContainerPure = ({ data: { story } }) => (
  <div>
    {/* author info here */}
    {/* frequency info here */}
    <StoryDetail story={story} />
    {/* chat here */}
    {/* chat input here */}
  </div>
);

export const StoryContainer = compose(getStory, displayLoadingState, pure)(
  StoryContainerPure
);
