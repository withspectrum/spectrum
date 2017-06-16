// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { withApollo } from 'react-apollo';
import { track } from '../../../helpers/events';
import {
  setLastSeenMutation,
  GET_DIRECT_MESSAGE_THREAD_QUERY,
} from '../../../api/directMessageThread';
import Messages from '../components/messages';
import Header from '../components/header';
import ChatInput from '../../../components/chatInput';
import { MessagesContainer, ViewContent } from '../style';

class ExistingThread extends Component {
  componentDidMount() {
    const threadId = this.props.match.params.threadId;
    this.props.setActiveThread(threadId);
    this.props.setLastSeen(threadId);
    this.forceScrollToBottom();
    track('direct message thread', 'viewed', null);
  }

  componentDidUpdate(prevProps) {
    this.forceScrollToBottom();

    if (prevProps.match.params.threadId !== this.props.match.params.threadId) {
      const threadId = this.props.match.params.threadId;
      this.props.setActiveThread(threadId);
      this.props.setLastSeen(threadId);
      this.forceScrollToBottom();
    }
  }

  forceScrollToBottom = () => {
    if (!this.scrollBody) return;
    let node = this.scrollBody;
    node.scrollTop = node.scrollHeight - node.clientHeight;
  };

  contextualScrollToBottom = () => {
    if (!this.scrollBody) return;
    let node = this.scrollBody;
    if (node.scrollHeight - node.clientHeight < node.scrollTop + 140) {
      node.scrollTop = node.scrollHeight - node.clientHeight;
    }
  };

  render() {
    const id = this.props.match.params.threadId;
    const { threads, currentUser } = this.props;

    if (id !== 'new') {
      const thread = threads.filter(thread => thread.id === id)[0];

      return (
        <MessagesContainer>
          <ViewContent innerRef={scrollBody => this.scrollBody = scrollBody}>
            <Header thread={thread} currentUser={currentUser} />
            <Messages
              id={id}
              currentUser={currentUser}
              forceScrollToBottom={this.forceScrollToBottom}
              contextualScrollToBottom={this.contextualScrollToBottom}
            />
          </ViewContent>

          <ChatInput
            thread={id}
            threadType={'directMessageThread'}
            forceScrollToBottom={this.forceScrollToBottom}
          />
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

export default compose(setLastSeenMutation, withApollo)(ExistingThread);
