//@flow
import React, { Component } from 'react';
import { Header } from './header';
import { Container } from '../DirectMessageThread/container';
import { ScrollBody } from '../DirectMessageThread/scrollbody';
import ChatInput from '../../ChatInput';

class DirectMessageComposer extends Component {
  static defaultProps = {
    recipient: React.PropTypes.object.isRequired,
  };

  render() {
    const state = this.context.store.getState();
    const recipient = state.messageComposer.recipient;

    return (
      <Container ref={'container'}>
        <ScrollBody>
          <Header recipient={recipient} />
        </ScrollBody>
        <ChatInput />
      </Container>
    );
  }
}

DirectMessageComposer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

export default DirectMessageComposer;
