//@flow
import React, { Component } from 'react';
//$FlowFixMe
import deepEqual from 'deep-eql';
//$FlowFixMe
import { connect } from 'react-redux';
import { login } from '../../../../actions/user';
import { subscribeFrequency } from '../../../../actions/frequencies';
import { getPermission } from '../../../../helpers/permissions';
import { Container, Footer, Text } from './style';
import Story from './Story';
import StoryActions from './StoryActions';
import Chat from '../../Components/Chat';
import { ScrollBody } from './ScrollBody';
import ChatInput from '../../Components/ChatInput';
import { Button, Spinner } from '../../../../shared/Globals';

class StoryChat extends Component {
  shouldComponentUpdate = (nextProps: Object) => {
    return !deepEqual(nextProps, this.props);
  };

  subscribeFrequency = () => {
    const { community, frequency } = this.props;

    this.props.dispatch(
      subscribeFrequency(
        {
          frequencySlug: frequency.slug,
          communitySlug: community.slug,
        },
        false,
      ),
    );
  };

  login = () => {
    this.props.dispatch(login());
  };

  forceScrollToBottom = () => {
    // calls the child method on ScrollBody to force a scroll to bottom when the current user sends a message
    this.scroll.forceScrollToBottom();
  };

  render = () => {
    const { community, frequency, story, messages, user } = this.props;
    const usersList = user.list;
    const currentUser = user;

    const frequencyRole = currentUser.uid &&
      frequency &&
      getPermission(currentUser.uid, frequency);

    const communityRole = currentUser.uid &&
      community &&
      getPermission(currentUser.uid, community);

    const isParticipant = story.participants
      ? story.participants[currentUser.uid] ? true : false
      : false;
    /*
     * Sometimes the underlying data for the story loads in async, so we need to handle
     * a fallback loading state while the data is retreived
    */
    if (!community || !frequency || !story) {
      return (
        <Container loading>
          <Spinner />
        </Container>
      );
    }

    return (
      <Container>
        <ScrollBody
          active={story}
          forceScrollToBottom={isParticipant}
          ref={scroll => this.scroll = scroll}
        >
          <Story story={story} frequency={frequency} community={community} />
          <StoryActions
            story={story}
            communityRole={communityRole}
            currentUser={currentUser}
            community={community}
            frequency={frequency}
          />
          <Chat
            messages={messages}
            usersList={usersList}
            currentUser={currentUser}
            forceScrollToBottom={isParticipant}
            type={'story'}
            activeCommunity={community.slug}
          />
        </ScrollBody>

        {currentUser.uid &&
          story.locked &&
          <Footer>
            <Text>It's cold in here...this chat has been frozen ❄️</Text>
          </Footer>}

        {currentUser.uid &&
          frequencyRole && //signed in and joined this frequency
          !story.locked &&
          <ChatInput forceScrollToBottom={this.forceScrollToBottom} />}

        {currentUser.uid &&
          !frequencyRole && // signed in, hasn't joined frequency
          <Footer>
            <Text>Feel like weighing in?</Text>
            <Button onClick={this.subscribeFrequency}>
              Join ~{frequency.name}
            </Button>
          </Footer>}

        {!currentUser.uid && // not signed in
          <Footer>
            <Text>Feel like weighing in?</Text>
            <Button onClick={this.login}>Sign in with Twitter</Button>
          </Footer>}
      </Container>
    );
  };
}

const mapStateToProps = (state: Object) => ({
  user: state.user,
});

export default connect(mapStateToProps)(StoryChat);
