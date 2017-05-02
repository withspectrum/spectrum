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

const MessagesWithData = ({
  data: { story: { messageConnection: { edges } } },
}) => {
  const sortedMessages = sortAndGroupMessages(edges);
  return (
    <MessagesContainer>
      <ChatMessages messages={sortedMessages} />
    </MessagesContainer>
  );
};

const Messages = compose(getStoryMessages, lifecycles, displayLoadingState)(
  MessagesWithData
);

export default Messages;
