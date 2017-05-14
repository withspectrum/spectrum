// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import lifecycle from 'recompose/lifecycle';
import { sortAndGroupMessages } from '../../../helpers/messages';
import ChatMessages from '../../../components/chatMessages';
import Icon from '../../../components/icons';
import { HorizontalRule } from '../../../components/globals';
import { displayLoadingCard } from '../../../components/loading';
import { getStoryMessages } from '../queries';
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
    <div>
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
  getStoryMessages,
  lifecycles,
  displayLoadingCard
)(MessagesWithData);

export default Messages;
