import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
import { sortAndGroupMessages } from '../../../helpers/messages';
import ChatMessages from '../../../components/messageGroup';
import Icon from '../../../components/icons';
import { HorizontalRule } from '../../../components/globals';
import { LoadingChat } from '../../../components/loading';
import { Button } from '../../../components/buttons';
import NewThreadShare from '../../../components/upsell/newThreadShare';
import { NullState } from '../../../components/upsell';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { ChatWrapper } from '../style';
import { getThreadMessages } from '../queries';
import { toggleReactionMutation } from '../mutations';

export const EmptyChat = ({ thread }) => (
  <ChatWrapper>
    <HorizontalRule>
      <hr />
      <Icon glyph={'message'} />
      <hr />
    </HorizontalRule>
    <NewThreadShare thread={thread} />
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
      this.props.data.thread &&
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
      setTimeout(() => this.props.forceScrollToBottom());
    }

    // force scroll to bottom if the user is a participant/creator, after the messages load in
    if (
      (!newMessageSent &&
        this.props.data.thread &&
        this.props.data.thread.messageConnection &&
        this.props.shouldForceScrollToTopOnMessageLoad) ||
      (!newMessageSent &&
        this.props.data.networkStatus === 7 &&
        this.props.shouldForceScrollToTopOnMessageLoad)
    ) {
      setTimeout(() => this.props.forceScrollToTop());
    }

    // force scroll to bottom when a message is sent in the same thread
    if (newMessageSent) {
      this.props.contextualScrollToBottom();
    }

    // if the thread changes in the inbox we have to update the subscription
    if (
      prevProps.data.thread &&
      this.props.data.thread &&
      prevProps.data.thread.id !== this.props.data.thread.id
    ) {
      this.unsubscribe().then(() => this.subscribe());
    }
  }

  componentDidMount() {
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
      data,
      isLoading,
      currentUser,
      toggleReaction,
      forceScrollToBottom,
      hasMessagesToLoad,
      id,
      isModerator,
    } = this.props;

    const dataExists =
      data &&
      data.thread &&
      data.thread.id === id &&
      data.thread.messageConnection;
    const messagesExist =
      dataExists && data.thread.messageConnection.edges.length > 0;

    if (messagesExist) {
      const unsortedMessages = data.thread.messageConnection.edges.map(
        message => message.node
      );

      const unique = array => {
        const processed = [];
        for (let i = array.length - 1; i >= 0; i--) {
          if (processed.indexOf(array[i].id) < 0) {
            processed.push(array[i].id);
          } else {
            array.splice(i, 1);
          }
        }
        return array;
      };

      const uniqueMessages = unique(unsortedMessages);
      const sortedMessages = sortAndGroupMessages(uniqueMessages);

      return (
        <ChatWrapper>
          <HorizontalRule>
            <hr />
            <Icon glyph={'message'} />
            <hr />
          </HorizontalRule>
          <ChatMessages
            threadId={data.thread.id}
            thread={data.thread}
            toggleReaction={toggleReaction}
            messages={sortedMessages}
            threadType={'story'}
            forceScrollToBottom={forceScrollToBottom}
            isModerator={isModerator}
          />
        </ChatWrapper>
      );
    }

    if (dataExists) {
      if (currentUser) {
        return <EmptyChat thread={data.thread} />;
      } else {
        return null;
      }
    }

    if (isLoading) {
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

    return (
      <NullState
        heading="Sorry, we lost connection to the server..."
        copy="Mind reloading the page?"
      >
        <Button icon="view-reload" onClick={() => window.location.reload(true)}>
          Reload
        </Button>
      </NullState>
    );
  }
}

const Messages = compose(
  toggleReactionMutation,
  getThreadMessages,
  viewNetworkHandler
)(MessagesWithData);

export default Messages;
