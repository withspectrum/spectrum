// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import StoryDetail from '../components/storyDetail';
import Messages from '../components/messages';
import ChatInput from '../components/chatInput';
import { Column } from '../../../components/column';
import { FlexContainer } from '../../../components/flexbox';
import { UserProfile, FrequencyProfile } from '../../../components/profile';
import { getStory } from '../queries';
import { displayLoadingScreen } from '../../../components/loading';
import { UpsellSignIn } from '../../../components/upsell';

const StoryContainerPure = ({
  data: { story, subscribeToNewMessages, error, loading },
  currentUser,
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
        {!currentUser && <UpsellSignIn />}
        <StoryDetail story={story} />
        <Messages id={story.id} currentUser={currentUser} />
        {// if user exists, and is either the story creator or a subscriber
        // of the frequency the story was posted in, the user can see the
        // chat input
        currentUser &&
          (story.isCreator || story.frequency.isSubscriber) &&
          <ChatInput thread={story.id} />}
      </Column>
    </FlexContainer>
  );
};

const StoryContainer = compose(getStory, displayLoadingScreen, pure)(
  StoryContainerPure
);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default connect(mapStateToProps)(StoryContainer);
