// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { StoryDetail } from '../components/storyDetail';
import Messages from '../components/messages';
import ChatInput from '../components/chatInput';
import { Column } from '../../../components/column';
import { FlexContainer } from '../../../components/flexbox';
import { UserProfile, FrequencyProfile } from '../../../components/profile';
import { getStory } from '../queries';
import { displayLoadingState } from '../../../components/loading';

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
const MessagesWithCurrentUser = connect(mapStateToProps)(Messages);

const StoryContainerPure = ({
  data: { story, subscribeToNewMessages, error, loading },
}) => {
  if (error) {
    return <div>Error getting this story</div>;
  }

  if (!story) {
    return <div>This story doesn't exist</div>;
  }

  return (
    <FlexContainer justifyContent="center">
      <Column type="secondary">
        <UserProfile data={{ user: story.author }} profileSize={'full'} />
        <FrequencyProfile data={{ frequency: story.frequency }} size="medium" />
      </Column>

      <Column type="primary">
        <StoryDetail story={story} />
        <MessagesWithCurrentUser id={story.id} />
        <ChatInput thread={story.id} />
      </Column>
    </FlexContainer>
  );
};

export const StoryContainer = compose(getStory, displayLoadingState, pure)(
  StoryContainerPure
);
