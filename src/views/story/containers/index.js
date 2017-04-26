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
import { Column } from '../../../components/column';
import { FlexContainer } from '../../../components/flexbox';
import { Card } from '../../../components/card';
import { Profile } from '../../../components/profile';
import { getStory } from '../queries';
import Loading from '../../../components/loading';

// TODO: Brian - figure out how to abstract this out to be used anywhere
const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
);

const StoryContainerPure = ({ data: { story } }) => {
  console.log(story);
  const userData = {
    photoURL: story.author.photoURL,
    title: story.author.displayName,
    subtitle: story.author.username,
    meta: [], // { icon: 'edit', label: 'Posts', count: '14' }
  };

  const frequencyData = {
    photoURL: story.author.photoURL,
    title: story.frequency.name,
    subtitle: story.frequency.id,
    meta: [],
  };

  return (
    <FlexContainer justifyContent="center">

      <Column type="secondary">
        <Profile data={userData} type="user" />
        <Profile data={frequencyData} type="frequency" />
      </Column>

      <Column type="primary">
        <Card>
          <StoryDetail story={story} />
        </Card>

        <Card>
          Chat goes here
        </Card>

        <Card>
          Chat input goes here
        </Card>
      </Column>
    </FlexContainer>
  );
};

export const StoryContainer = compose(getStory, displayLoadingState, pure)(
  StoryContainerPure
);
