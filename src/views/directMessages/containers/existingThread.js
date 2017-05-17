// @flow
import React, { Component } from 'react';
import Messages from '../components/messages';
import Header from '../components/header';
import ChatInput from '../../../components/chatInput';
import { MessagesContainer, ViewContent } from '../style';

class ExistingThread extends Component {
  componentDidMount() {
    const threadId = this.props.match.params.threadId;
    this.props.setActiveThread(threadId);
    this.forceScrollToBottom();
  }

  componentDidUpdate(prevProps) {
    this.forceScrollToBottom();

    if (prevProps.match.params.threadId !== this.props.match.params.threadId) {
      const threadId = this.props.match.params.threadId;
      this.props.setActiveThread(threadId);
      this.forceScrollToBottom();
    }
  }

  forceScrollToBottom = () => {
    if (!this.scrollBody) return;
    let node = this.scrollBody;
    node.scrollTop = node.scrollHeight - node.clientHeight;
  };

  render() {
    const id = this.props.match.params.threadId;
    const { groups, currentUser } = this.props;

    if (id !== 'new') {
      const group = groups.filter(group => group.id === id)[0];

      return (
        <MessagesContainer>
          <ViewContent innerRef={scrollBody => this.scrollBody = scrollBody}>
            <Header group={group} currentUser={currentUser} />
            <Messages
              id={id}
              currentUser={currentUser}
              forceScrollToBottom={this.forceScrollToBottom}
            />
          </ViewContent>

          <ChatInput thread={id} />
        </MessagesContainer>
      );
    }

    /*
      if we are viewing /new we will handle the messages view in the composer
      component
    */
    return null;
  }
}

export default ExistingThread;
