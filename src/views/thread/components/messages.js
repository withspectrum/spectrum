import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
import InfiniteList from 'react-infinite-scroller-with-scroll-element';
import { sortAndGroupMessages } from '../../../helpers/messages';
import ChatMessages from '../../../components/messageGroup';
import { LoadingChat } from '../../../components/loading';
import { Button } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { NullState } from '../../../components/upsell';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import NextPageButton from '../../../components/nextPageButton';
import { ChatWrapper, NullMessagesWrapper, NullCopy } from '../style';
import { getThreadMessages } from '../queries';
import { toggleReactionMutation } from '../mutations';

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
        this.props.shouldForceScrollToTopOnMessageLoad) ||
      (!newMessageSent &&
        this.props.data.networkStatus === 7 &&
        this.props.shouldForceScrollToTopOnMessageLoad)
    ) {
      setTimeout(() => this.props.forceScrollToTop());
    }

    // force scroll to bottom when a message is sent in the same thread
    if (newMessageSent && !prevProps.isFetchingMore) {
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
      toggleReaction,
      forceScrollToBottom,
      hasMessagesToLoad,
      id,
      isModerator,
      isFetchingMore,
      loadPreviousPage,
      loadNextPage,
      scrollContainer,
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
      const sortedMessages = sortAndGroupMessages(
        uniqueMessages,
        data.thread.currentUserLastSeen
      );

      return (
        <ChatWrapper>
          {data.thread.messageConnection.pageInfo.hasPreviousPage && (
            <NextPageButton
              isFetchingMore={isFetchingMore}
              fetchMore={loadPreviousPage}
            />
          )}
          <InfiniteList
            pageStart={0}
            loadMore={loadNextPage}
            hasMore={data.thread.messageConnection.pageInfo.hasNextPage}
            loader={<LoadingChat size="small" />}
            useWindow={false}
            initialLoad={false}
            scrollElement={scrollContainer}
            threshold={750}
          >
            <ChatMessages
              threadId={data.thread.id}
              thread={data.thread}
              toggleReaction={toggleReaction}
              messages={sortedMessages}
              threadType={'story'}
              forceScrollToBottom={forceScrollToBottom}
              isModerator={isModerator}
            />
          </InfiniteList>
        </ChatWrapper>
      );
    }

    if (isLoading) {
      return <ChatWrapper>{hasMessagesToLoad && <LoadingChat />}</ChatWrapper>;
    }

    if (!messagesExist) {
      return (
        <NullMessagesWrapper>
          <Icon glyph={'emoji'} size={64} />
          <NullCopy>
            No messages have been sent in this conversation yet - why don't you
            kick things off below?
          </NullCopy>
        </NullMessagesWrapper>
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
