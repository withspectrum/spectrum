// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
import { sortAndGroupMessages } from '../../../helpers/messages';
import ChatMessages from '../../../components/chatMessages';
import { Loading } from '../../../components/loading';
import Icon from '../../../components/icons';
import { HorizontalRule } from '../../../components/globals';
import { getDirectMessageThreadMessages } from '../queries';
import { toggleReactionMutation } from '../mutations';
import { MessagesScrollWrapper } from './style';

class MessagesWithData extends Component {
  state: {
    subscription: ?Object,
  };

  state = {
    subscription: null,
  };

  componentDidMount() {
    this.props.forceScrollToBottom();
    this.subscribe();
  }

  componentDidUpdate(prev) {
    const { contextualScrollToBottom, data } = this.props;

    if (prev.data.loading && !this.props.data.loading) {
      this.subscribe();
      setTimeout(() => this.props.forceScrollToBottom());
    }
    // force scroll to bottom when a message is sent in the same thread
    if (prev.data.messages !== data.messages && contextualScrollToBottom) {
      contextualScrollToBottom();
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe = () => {
    this.setState({
      subscription: this.props.subscribeToNewMessages(),
    });
  };

  unsubscribe = () => {
    const { subscription } = this.state;
    if (subscription) {
      // This unsubscribes the subscription
      subscription();
    }
  };

  render() {
    const { data: { error, loading, messages }, data } = this.props;
    const { subscription } = this.state;

    if (error) {
      return <div>Error!</div>;
    }

    if (loading) {
      return <Loading />;
    }

    if ((!loading && !messages) || !subscription) {
      return <div />;
    }

    const sortedMessages = sortAndGroupMessages(messages);
    return (
      <MessagesScrollWrapper>
        <div style={{ padding: '24px 0', background: '#fff' }}>
          <HorizontalRule>
            <hr />
            <Icon glyph="message" />
            <hr />
          </HorizontalRule>
        </div>
        <ChatMessages
          toggleReaction={this.props.toggleReaction}
          messages={sortedMessages}
          forceScrollToBottom={this.props.forceScrollToBottom}
          contextualScrollToBottom={this.props.contextualScrollToBottom}
          threadId={this.props.id}
          threadType={'directMessageThread'}
        />
      </MessagesScrollWrapper>
    );
  }
}

const Messages = compose(
  toggleReactionMutation,
  getDirectMessageThreadMessages,
  pure
)(MessagesWithData);

export default Messages;
