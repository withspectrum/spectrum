//@flow
import React, { Component } from 'react';
//$FlowFixMe
import deepEqual from 'deep-eql';

import { Header } from './header';
import { Container } from './container';
import { ScrollBody } from '../../Components/ScrollBody';
import Chat from '../../Components/Chat';
import ChatInput from '../../Components/ChatInput';

class DirectMessageThread extends Component {
  static defaultProps = {
    active: React.PropTypes.object.isRequired,
  };

  shouldComponentUpdate(nextProps: Object) {
    return !deepEqual(nextProps, this.props);
  }

  render() {
    const state = this.context.store.getState();
    const messages = this.props.messages;
    const activeThread = this.props.active;
    const usersList = state.user.list;
    const currentUser = state.user;

    const users = Object.keys(activeThread.users)
      .map(user => usersList[user]) // get the user objects
      .filter(user => user.uid !== currentUser.uid); // filter out the current user

    return (
      <Container>
        <ScrollBody active={activeThread} forceScrollToBottom>
          <Header users={users} />
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

DirectMessageThread.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

export default DirectMessageThread;
