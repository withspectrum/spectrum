// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import lifecycle from 'recompose/lifecycle';
import { sortAndGroupMessages } from '../../../helpers/messages';
import ChatMessages from '../../../components/chatMessages';
import { displayLoadingState } from '../../../components/loading';
import Icon from '../../../components/icons';
import { HorizontalRule } from '../../../components/globals';
import { getDirectMessageGroupMessages } from '../queries';
import { toggleReactionMutation } from '../mutations';

const lifecycles = lifecycle({
  state: {
    subscribed: false,
  },
  componentDidUpdate() {
    if (!this.props.loading && !this.state.subscribed) {
      this.setState({
        subscribed: true,
      });
      this.props.subscribeToNewMessages();
    }
  },
});

const MessagesWithData = ({
  data: { error, loading, messages },
  toggleReaction,
}) => {
  if (error) {
    return <div>Error!</div>;
  }

  if (!messages) {
    return <div>No messages yet!</div>;
  }

  const sortedMessages = sortAndGroupMessages(messages);
  return (
    <div
      style={{
        display: 'flex',
        overflowY: 'scroll',
        flexDirection: 'column',
        flex: '1',
      }}
    >
      <HorizontalRule>
        <hr />
        <Icon icon={'messages'} color="border.default" />
        <hr />
      </HorizontalRule>
      <ChatMessages toggleReaction={toggleReaction} messages={sortedMessages} />
    </div>
  );
};

const Messages = compose(
  toggleReactionMutation,
  getDirectMessageGroupMessages,
  lifecycles,
  displayLoadingState
)(MessagesWithData);

export default Messages;
