// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
import { sortAndGroupMessages } from '../../../helpers/messages';
import ChatMessages from '../../../components/chatMessages';
import Icon from '../../../components/icons';
import { HorizontalRule } from '../../../components/globals';
import { displayLoadingCard } from '../../../components/loading';
import { ChatWrapper } from '../style';
import { getThreadMessages } from '../queries';
import { toggleReactionMutation } from '../mutations';

class MessagesWithData extends Component {
  state: {
    subscribed: boolean,
  };

  constructor() {
    super();

    this.state = {
      subscribed: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loading && !this.state.subscribed) {
      this.setState({
        subscribed: true,
      });
      this.props.subscribeToNewMessages();
    }

    // force scroll to bottom when a message is sent in the same thread
    if (
      prevProps.data.thread.messageConnection !==
      this.props.data.thread.messageConnection
    ) {
      this.props.contextualScrollToBottom();
    }
  }

  componentDidMount() {
    this.props.forceScrollToBottom();
    this.subscribe();
  }

  subscribe = () => {
    if (!this.props.loading && !this.state.subscribed) {
      this.setState({
        subscribed: true,
      });
      this.props.subscribeToNewMessages();
    }
  };

  render() {
    const { data, toggleReaction, forceScrollToBottom } = this.props;

    console.log('in component with ', data);

    if (data.error) {
      return <div>Error!</div>;
    }

    if (!data.thread && !data.thread.messageConnection) {
      return <div>No messages yet!</div>;
    }

    const sortedMessages = sortAndGroupMessages(
      data.thread.messageConnection.edges
    );

    return (
      <ChatWrapper>
        <HorizontalRule>
          <hr />
          <Icon glyph={'message'} />
          <hr />
        </HorizontalRule>
        <ChatMessages
          threadId={data.thread.id}
          toggleReaction={toggleReaction}
          messages={sortedMessages}
          threadType={'story'}
          forceScrollToBottom={forceScrollToBottom}
        />
      </ChatWrapper>
    );
  }
}

const Messages = compose(
  toggleReactionMutation,
  getThreadMessages,
  displayLoadingCard
)(MessagesWithData);

export default Messages;
