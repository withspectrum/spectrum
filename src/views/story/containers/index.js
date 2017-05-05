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
import Messages from '../components/messages';
import ChatInput from '../components/chatInput';
import { Column } from '../../../components/column';
import { FlexContainer } from '../../../components/flexbox';
import { UserProfile, FrequencyProfile } from '../../../components/profile';
import { getStory } from '../queries';
import { Loading } from '../../../components/loading';

// TODO: Brian - figure out how to abstract this out to be used anywhere
const displayLoadingState = branch(
  props => !props.data || props.data.loading,
  renderComponent(Loading)
);

const StoryContainerPure = ({
  data: { story, subscribeToNewMessages, error, loading },
}) => {
  return (
    <FlexContainer justifyContent="center">
      <Column type="secondary">
        <UserProfile data={{ user: story.author }} profileSize={'full'} />
        <FrequencyProfile data={{ frequency: story.frequency }} size="medium" />
      </Column>

      <Column type="primary">
        <StoryDetail story={story} />
        <Messages id={story.id} />
        <ChatInput thread={story.id} />
      </Column>
    </FlexContainer>
  );
};

export const StoryContainer = compose(getStory, displayLoadingState, pure)(
  StoryContainerPure
);
