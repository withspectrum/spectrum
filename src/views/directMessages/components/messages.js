// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
import { sortAndGroupMessages } from '../../../helpers/messages';
import ChatMessages from '../../../components/chatMessages';
import { displayLoadingState } from '../../../components/loading';
import Icon from '../../../components/icons';
import { HorizontalRule } from '../../../components/globals';
import { getDirectMessageThreadMessages } from '../queries';
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

  componentDidMount() {
    this.props.forceScrollToBottom();
  }

  componentDidUpdate() {
    if (!this.props.loading && !this.state.subscribed) {
      this.setState({
        subscribed: true,
      });
      this.props.subscribeToNewMessages();
    }
  }

  render() {
    const { data: { error, messages } } = this.props;

    if (error) {
      return <div>Error!</div>;
    }

    if (!messages) {
      return <div />;
    }

    const sortedMessages = sortAndGroupMessages(messages);

    return (
      <div style={{ width: '100%' }}>
        <div style={{ padding: '24px 0', background: '#fff' }}>
          <HorizontalRule>
            <hr />
            <Icon glyph="messages" />
            <hr />
          </HorizontalRule>
        </div>
        <ChatMessages
          toggleReaction={this.props.toggleReaction}
          messages={sortedMessages}
          forceScrollToBottom={this.props.forceScrollToBottom}
        />
      </div>
    );
  }
}

const Messages = compose(
  toggleReactionMutation,
  getDirectMessageThreadMessages,
  displayLoadingState
)(MessagesWithData);

export default Messages;
