//@flow
import React from 'react';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import lifecycle from 'recompose/lifecycle';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
import { StoryDetail } from '../components/storyDetail';
import Messages from '../components/messages';
import ChatInput from '../components/chatInput';
import { Column } from '../../../components/column';
import { FlexContainer } from '../../../components/flexbox';
import { Card } from '../../../components/card';
import { UserProfile, FrequencyProfile } from '../../../components/profile';
import { getStory } from '../queries';
import { Loading } from '../../../components/loading';

const lifecycles = lifecycle({
  state: {
    subscribed: false,
  },
  componentDidUpdate() {
    console.log('cdu', this.props);
    if (!this.props.data.loading && !this.state.subscribed) {
      this.setState({
        subscribed: true,
      });
      this.props.data.subscribeToNewMessages();
    }
  },
});

// TODO: Brian - figure out how to abstract this out to be used anywhere
const displayLoadingState = branch(
  props => !props.data || props.data.loading,
  renderComponent(Loading)
);

const StoryContainerPure = ({ data }) => {
  console.log('component ', data);
  return (
    <FlexContainer justifyContent="center">
      <Column type="secondary">
        <UserProfile
          data={{ user: data.story.author }}
          profileSize={'medium'}
        />
        <FrequencyProfile
          data={{ frequency: data.story.frequency }}
          size="medium"
        />
      </Column>

      <Column type="primary">
        <Card>
          <StoryDetail story={data.story} />
        </Card>

        <Card>
          <Messages messages={data.story.messageConnection.edges} />
        </Card>

        <Card>
          <ChatInput thread={data.story.id} />
        </Card>
      </Column>
    </FlexContainer>
  );
};

export const StoryContainer = compose(
  getStory,
  lifecycles,
  displayLoadingState,
  pure
)(StoryContainerPure);
