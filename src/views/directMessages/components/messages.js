// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import lifecycle from 'recompose/lifecycle';
import { sortAndGroupMessages } from '../../../helpers/messages';
import ChatMessages from '../../../components/chatMessages';
import { displayLoadingCard } from '../../../components/loading';
import { getDirectMessageGroupMessages } from '../queries';
// import { toggleReactionMutation } from '../mutations';

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

const MessagesWithData = ({ data: { error, messages } }) => {
  if (error) {
    return <div>Error!</div>;
  }

  if (!messages) {
    return <div>No messages yet!</div>;
  }

  const sortedMessages = sortAndGroupMessages(messages);
  return <ChatMessages messages={sortedMessages} />;
};

const Messages = compose(
  getDirectMessageGroupMessages,
  lifecycles,
  displayLoadingCard
)(MessagesWithData);

export default Messages;
