// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { toggleFrequencySubscriptionMutation } from '../../../api/frequency';
import { addToastWithTimeout } from '../../../actions/toasts';
import StoryDetail from '../components/storyDetail';
import Messages from '../components/messages';
import ChatInput from '../components/chatInput';
import { Column } from '../../../components/column';
import { FlexContainer } from '../../../components/flexbox';
import { UserProfile, FrequencyProfile } from '../../../components/profile';
import { getStory } from '../queries';
import { displayLoadingScreen } from '../../../components/loading';
import { Container } from '../style';
import {
  UpsellSignIn,
  UpsellJoinFrequency,
  Upsell404Story,
} from '../../../components/upsell';

const StoryContainerPure = ({
  data: { story, subscribeToNewMessages, error, loading },
  currentUser,
  dispatch,
  toggleFrequencySubscription,
}) => {
  if (error) {
    return <Upsell404Story />;
  }

  if (!story || story.deleted) {
    return <Upsell404Story />;
  }

  // show a full size profile for the frequency if the user hasn't joined it
  let size;
  if (!currentUser || (currentUser && story.frequency.isSubscriber)) {
    size = 'mini';
  } else {
    size = 'full';
  }

  const toggleSubscription = id => {
    toggleFrequencySubscription({ id })
      .then(({ data: { toggleFrequencySubscription } }) => {
        const str = toggleFrequencySubscription.isSubscriber
          ? `Joined ${toggleFrequencySubscription.name} in ${toggleFrequencySubscription.community.name}!`
          : `Left the frequency ${toggleFrequencySubscription.name} in ${toggleFrequencySubscription.community.name}.`;

        const type = toggleFrequencySubscription.isSubscriber
          ? 'success'
          : 'neutral';
        dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err));
      });
  };

  return (
    <FlexContainer justifyContent="center">
      <Column type="secondary">
        <UserProfile data={{ user: story.author }} profileSize={'full'} />
        <FrequencyProfile
          data={{ frequency: story.frequency }}
          profileSize={size}
        />
      </Column>

      <Column type="primary">
        <Container>
          {!currentUser && <UpsellSignIn />}
          <StoryDetail story={story} />
          <Messages id={story.id} currentUser={currentUser} />
          {// if user exists, and is either the story creator or a subscriber
          // of the frequency the story was posted in, the user can see the
          // chat input
          currentUser &&
            (story.isAuthor || story.frequency.isSubscriber) &&
            <ChatInput thread={story.id} />}

          {// if the user exists but isn't a subscriber to the frequency,
          // show an upsell to join the frequency
          currentUser &&
            !story.frequency.isSubscriber &&
            <UpsellJoinFrequency
              frequency={story.frequency}
              subscribe={toggleSubscription}
            />}
        </Container>
      </Column>
    </FlexContainer>
  );
};

const StoryContainer = compose(
  toggleFrequencySubscriptionMutation,
  getStory,
  displayLoadingScreen,
  pure
)(StoryContainerPure);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default connect(mapStateToProps)(StoryContainer);
