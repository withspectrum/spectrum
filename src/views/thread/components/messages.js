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
import { ChatWrapper } from '../style';
import { getThreadMessages } from '../queries';
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
      />
    </ChatWrapper>
  );
};

const Messages = compose(
  toggleReactionMutation,
  getThreadMessages,
  lifecycles,
  displayLoadingCard
)(MessagesWithData);

export default Messages;
