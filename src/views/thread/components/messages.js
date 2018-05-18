// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import InfiniteList from 'src/components/infiniteScroll';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { sortAndGroupMessages } from 'shared/clients/group-messages';
import ChatMessages from '../../../components/messageGroup';
import { LoadingChat } from '../../../components/loading';
import { Button } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { NullState } from '../../../components/upsell';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import Head from '../../../components/head';
import NextPageButton from '../../../components/nextPageButton';
import { ChatWrapper, NullMessagesWrapper, NullCopy } from '../style';
import getThreadMessages from 'shared/graphql/queries/thread/getThreadMessageConnection';
import toggleReactionMutation from 'shared/graphql/mutations/reaction/toggleReaction';
import type { Location } from 'react-router';

type State = {
  subscription: ?Function,
};

type MessageType = {
  cursor: string,
  node: {
    id: string,
  },
};

type Props = {
  toggleReaction: Function,
  isLoading: boolean,
  location: Location,
  forceScrollToBottom: Function,
  forceScrollToTop: Function,
  contextualScrollToBottom: Function,
  hasMessagesToLoad: boolean,
  id: string,
  isModerator: boolean,
  isFetchingMore: boolean,
  loadPreviousPage: Function,
  loadNextPage: Function,
  scrollContainer: any,
  subscribeToNewMessages: Function,
  threadIsLocked: boolean,
  lastSeen: ?number | ?Date,
  data: {
    thread: {
      id: string,
      currentUserLastSeen: Date | number,
      messageConnection: {
        pageInfo: {
          hasNextPage: boolean,
        },
        edges: Array<MessageType>,
      },
    },
  },
};

class MessagesWithData extends React.Component<Props, State> {
  state = {
    subscription: null,
  };

  componentDidUpdate(prev = {}) {
    const curr = this.props;

    if (!curr.data.thread) return;

    const isDifferentThread =
      prev.data &&
      prev.data.thread &&
      prev.data.thread.id !== curr.data.thread.id;
    const hadMessagesLoaded =
      prev.data && prev.data.thread && !!prev.data.thread.messageConnection;
    const hasMessagesLoaded =
      curr.data && curr.data.thread && !!curr.data.thread.messageConnection;
    const isFirstLoad =
      isDifferentThread || (!hadMessagesLoaded && hasMessagesLoaded);
    // Check if a single new message has been sent
    const newMessageSent =
      hadMessagesLoaded &&
      hasMessagesLoaded &&
      prev.data.thread.messageConnection.edges.length + 1 ===
        curr.data.thread.messageConnection.edges.length;

    // if browser recived specified message permalink, scroll to exact specified message @see https://github.com/withspectrum/spectrum/pull/3093
    let isMessageParmalink = false;
    const hash = this.props.location.hash;
    if (hash.length !== 0) {
      // hash = "" or "#8c541093-93dd-447d-a55c-00bd25f77599" like
      // scroll destination component defined in spectrum/src/components/message/index.js
      const messageLink = document.querySelector(
        `a[data-message-parmalink="${hash.substr(1)}"]`
      );
      if (messageLink) {
        isMessageParmalink = true;
        // sumulate click empty <a href="#8c541093-93dd-447d-a55c-00bd25f77599"></> and then we've got scroll to the message
        setTimeout(() => messageLink.click());
      } else {
        // messageId not exist
        // TODO(@ryota-murakami) how to handle the case? scrollBottom | show threadTop | show popup message etc...
      }
    }

    // force scroll to bottom if the user is a participant/creator, after the messages load in for the first time
    if (!newMessageSent && isFirstLoad && curr.shouldForceScrollOnMessageLoad) {
      if (!isMessageParmalink) {
        setTimeout(() => curr.forceScrollToBottom());
      }
    }

    // force scroll to top if the user is a participant/creator, after the messages load in for the first time
    if (
      !newMessageSent &&
      isFirstLoad &&
      curr.shouldForceScrollToTopOnMessageLoad
    ) {
      setTimeout(() => curr.forceScrollToTop());
    }

    // force scroll to bottom when a message is sent in the same thread
    if (newMessageSent && !prev.isFetchingMore) {
      curr.contextualScrollToBottom();
    }

    // if the thread changes in the inbox we have to update the subscription
    if (
      prev.data.thread &&
      curr.data.thread &&
      prev.data.thread.id !== curr.data.thread.id
    ) {
      // $FlowFixMe
      this.unsubscribe()
        .then(() => this.subscribe())
        .catch(err => console.error('Error unsubscribing: ', err));
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
      location,
      threadIsLocked,
      lastSeen,
    } = this.props;

    // TODO locationのhashの中にmesssageIDがあればScrollToMessageを起動する

    const dataExists =
      data &&
      data.thread &&
      data.thread.id === id &&
      data.thread.messageConnection;
    const messagesExist =
      dataExists && data.thread.messageConnection.edges.length > 0;

    if (messagesExist) {
      const { edges, pageInfo } = data.thread.messageConnection;
      const unsortedMessages = edges.map(message => message.node);

      const uniqueMessages = deduplicateChildren(unsortedMessages, 'id');
      const sortedMessages = sortAndGroupMessages(uniqueMessages);

      return (
        <ChatWrapper>
          {pageInfo.hasPreviousPage && (
            <div>
              <NextPageButton
                isFetchingMore={isFetchingMore}
                fetchMore={loadPreviousPage}
              />
              <Head>
                <link
                  rel="prev"
                  href={`${location.pathname}?msgsbefore=${edges[0].cursor}`}
                />
                <link rel="canonical" href={`/thread/${data.thread.id}`} />
              </Head>
            </div>
          )}
          {pageInfo.hasNextPage && (
            <Head>
              <link
                rel="next"
                href={`${location.pathname}?msgsafter=${
                  edges[edges.length - 1].cursor
                }`}
              />
              <link rel="canonical" href={`/thread/${data.thread.id}`} />
            </Head>
          )}
          <InfiniteList
            pageStart={0}
            loadMore={loadNextPage}
            isLoadingMore={this.props.isFetchingMore}
            hasMore={pageInfo.hasNextPage}
            loader={<LoadingChat size="small" />}
            useWindow={false}
            initialLoad={false}
            scrollElement={scrollContainer}
            threshold={750}
            className={'scroller-for-messages'}
          >
            <ChatMessages
              threadId={data.thread.id}
              thread={data.thread}
              toggleReaction={toggleReaction}
              messages={sortedMessages}
              threadType={'story'}
              forceScrollToBottom={forceScrollToBottom}
              isModerator={isModerator}
              lastSeen={lastSeen}
            />
          </InfiniteList>
        </ChatWrapper>
      );
    }

    if (isLoading) {
      return <ChatWrapper>{hasMessagesToLoad && <LoadingChat />}</ChatWrapper>;
    }

    if (!messagesExist) {
      if (threadIsLocked) return null;
      return (
        <NullMessagesWrapper>
          <Icon glyph={'emoji'} size={64} />
          <NullCopy>
            No messages have been sent in this conversation yet - why don’t you
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
  withRouter,
  getThreadMessages,
  viewNetworkHandler
)(MessagesWithData);

export default Messages;
