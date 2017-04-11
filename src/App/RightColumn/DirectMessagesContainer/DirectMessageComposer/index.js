//@flow
import React, { Component } from 'react';
import { Header } from './header';
import { Container } from '../DirectMessageThread/container';
import ChatInput from '../../Components/ChatInput';

class DirectMessageComposer extends Component {
  static defaultProps = {
    recipient: React.PropTypes.object.isRequired,
  };

  render() {
    const state = this.context.store.getState();
    const recipient = state.messageComposer.recipient;

    return (
      <Container ref={'container'}>
        <Header recipient={recipient} />
        <ChatInput />
      </Container>
    );
  }
}

DirectMessageComposer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

export default DirectMessageComposer;
