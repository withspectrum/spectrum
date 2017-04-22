//@flow
import React from 'react';
import branch from 'recompose/branch';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import renderComponent from 'recompose/renderComponent';
import { StoryDetail } from '../components/storyDetail';
import { getStory } from '../queries';
import Loading from '../../ui/components/loading';

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
