//@flow
import React, { Component } from 'react';
//$FlowFixMe
import deepEqual from 'deep-eql';
import { Container } from './container';
import { ScrollBody } from './scrollbody';
import Story from './Story';
import Chat from './Chat';
import ChatInput from '../../ChatInput';

class StoryChat extends Component {
  static defaultProps = {
    story: React.PropTypes.object.isRequired,
    community: React.PropTypes.object,
    frequency: React.PropTypes.object,
    messages: React.PropTypes.array,
  };

  shouldComponentUpdate(nextProps: Object) {
    return !deepEqual(nextProps, this.props);
  }

  render() {
    const state = this.context.store.getState();
    const { community, frequency, story, messages } = this.props;
    const usersList = state.user.list;
    const currentUser = state.user;

    return (
      <Container ref={'container'}>
        <ScrollBody>
          <Story story={story} frequency={frequency} community={community} />
          <Chat
            messages={messages}
            usersList={usersList}
            currentUser={currentUser}
          />
        </ScrollBody>
        <ChatInput />
      </Container>
    );
  }
}

StoryChat.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

export default StoryChat;
