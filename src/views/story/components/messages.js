// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import branch from 'recompose/branch';
// $FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import lifecycle from 'recompose/lifecycle';
import { sortAndGroupMessages } from '../../../helpers/messages';
import ChatMessages from '../../../components/chatMessages';
import { LoadingCard } from '../../../components/loading';
import { getStoryMessages } from '../queries';
import { toggleReaction } from '../mutations';
import { MessagesContainer } from '../style';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

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

const MessagesWithData = ({ data, toggleReaction }) => {
  if (data.error) {
    return <div>Error!</div>;
  }

  if (!data.story && !data.story.messageConnection) {
    return <div>No messages yet!</div>;
  }

  const sortedMessages = sortAndGroupMessages(
    data.story.messageConnection.edges
  );
  return (
    <ChatMessages toggleReaction={toggleReaction} messages={sortedMessages} />
  );
};

const Messages = compose(
  toggleReaction,
  getStoryMessages,
  lifecycles,
  displayLoadingState
)(MessagesWithData);

export default Messages;
