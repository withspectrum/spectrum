// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
import { sortAndGroupMessages } from '../../../helpers/messages';
import ChatMessages from '../../../components/chatMessages';
import Icon from '../../../components/icons';
import { HorizontalRule } from '../../../components/globals';
import { LoadingChat } from '../../../components/loading';
import { Button } from '../../../components/buttons';
import { NullState } from '../../../components/upsell';
import { ChatWrapper } from '../style';
import { getThreadMessages } from '../queries';
import { toggleReactionMutation } from '../mutations';

export const EmptyChat = () => (
  <ChatWrapper>
    <HorizontalRule>
      <hr />
      <Icon glyph={'message'} />
      <hr />
    </HorizontalRule>
    <NullState
      heading={`🔥 This thread is hot off the presses...`}
      copy={`Why don't you kick off the conversation?`}
    />
  </ChatWrapper>
);

class MessagesWithData extends Component {
  state: {
    subscription: ?Object,
  };

  state = {
    subscription: null,
  };

  componentDidUpdate(prevProps) {
    const newMessageSent =
      prevProps &&
      prevProps.data &&
      prevProps.data.thread &&
      prevProps.data.thread.messageConnection !==
        this.props.data.thread.messageConnection;

    // force scroll to bottom if the user is a participant/creator, after the messages load in
    if (
      (!newMessageSent &&
        this.props.data.thread &&
        this.props.data.thread.messageConnection &&
        this.props.shouldForceScrollOnMessageLoad) ||
      (!newMessageSent &&
        this.props.data.networkStatus === 7 &&
        this.props.shouldForceScrollOnMessageLoad)
    ) {
      setTimeout(() => this.props.forceScrollToBottom(), 1);
    }

    // force scroll to bottom when a message is sent in the same thread
    if (newMessageSent) {
      this.props.contextualScrollToBottom();
    }

    // if the thread changes in the inbox we have to update the subscription
    if (
      prevProps.data.thread &&
      prevProps.data.thread.id !== this.props.data.thread.id
    ) {
      this.unsubscribe().then(() => this.subscribe());
    }
  }

  componentDidMount() {
    const { currentUser } = this.props;
    if (!currentUser || !currentUser.id) return;

    this.subscribe();
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
      return Promise.resolve(subscription());
    }
  };

  render() {
    const {
      data: { networkStatus, error },
      data,
      currentUser,
      toggleReaction,
      forceScrollToBottom,
      hasMessagesToLoad,
      viewStatus,
    } = this.props;

    const dataExists =
      networkStatus === 7 && data.thread && data.thread.messageConnection;
    const messagesExist =
      dataExists && data.thread.messageConnection.edges.length > 0;

    if (networkStatus === 8 || error) {
      return (
        <NullState
          heading="Sorry, we lost connection to the server..."
          copy="Mind reloading the page?"
        >
          <Button
            icon="view-reload"
            onClick={() => window.location.reload(true)}
          >
            Reload
          </Button>
        </NullState>
      );
    }

    if (messagesExist) {
      const unsortedMessages = data.thread.messageConnection.edges.map(
        message => message.node
      );
      const sortedMessages = sortAndGroupMessages(unsortedMessages);

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

    if (networkStatus === 7) {
      if (currentUser) {
        return <EmptyChat />;
      } else {
        return null;
      }
    } else {
      return (
        <ChatWrapper>
          <HorizontalRule>
            <hr />
            <Icon glyph={'message'} />
            <hr />
          </HorizontalRule>
          {hasMessagesToLoad && <LoadingChat />}
        </ChatWrapper>
      );
    }
  }
}

const Messages = compose(toggleReactionMutation, getThreadMessages)(
  MessagesWithData
);

export default Messages;
