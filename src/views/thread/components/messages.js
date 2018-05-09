// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import idx from 'idx';
import InfiniteList from 'src/components/infiniteScroll';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { sortAndGroupMessages } from 'shared/clients/group-messages';
import type { ThreadInfoType } from 'shared/graphql/fragments/thread/threadInfo';
import ChatMessages from '../../../components/messageGroup';
import { LoadingChat } from '../../../components/loading';
import { Button } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { NullState } from '../../../components/upsell';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import Head from '../../../components/head';
import NextPageButton from '../../../components/nextPageButton';
import {
  ChatWrapper,
  NullMessagesWrapper,
  NullCopy,
  EmptyThreadHeading,
  EmptyThreadDescription,
  TwitterButton,
  SocialButtonLabel,
  SocialIcon,
  FacebookButton,
  SocialShareWrapper,
  A,
} from '../style';
import getThreadMessages from 'shared/graphql/queries/thread/getThreadMessageConnection';
import toggleReactionMutation from 'shared/graphql/mutations/reaction/toggleReaction';

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
  location: Object,
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
    thread: ThreadInfoType,
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

    // force scroll to bottom if the user is a participant/creator, after the messages load in for the first time
    if (!newMessageSent && isFirstLoad && curr.shouldForceScrollOnMessageLoad) {
      setTimeout(() => curr.forceScrollToBottom());
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

  getIsAuthor = () => idx(this.props, _ => _.data.thread.isAuthor);

  getNonAuthorEmptyMessage = () => {
    return (
      <NullMessagesWrapper>
        <Icon glyph={'emoji'} size={64} />
        <NullCopy>
          No messages have been sent in this conversation yet - why don’t you
          kick things off below?
        </NullCopy>
      </NullMessagesWrapper>
    );
  };

  getAuthorEmptyMessage = () => {
    const threadTitle = idx(this.props, _ => _.data.thread.content.title) || '';
    const threadId = idx(this.props, _ => _.data.thread.id) || '';

    return (
      <NullMessagesWrapper>
        <EmptyThreadHeading>No replies yet</EmptyThreadHeading>
        <EmptyThreadDescription>
          Share your post on other social media sites
        </EmptyThreadDescription>
        <SocialShareWrapper>
          <A
            href={`https://twitter.com/share?text=${threadTitle} on @withspectrum&url=https://spectrum.chat/thread/${threadId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterButton>
              <SocialIcon glyph={'twitter'} />
              <SocialButtonLabel>Share on Twitter</SocialButtonLabel>
            </TwitterButton>
          </A>
          <A
            href={`https://www.facebook.com/sharer/sharer.php?u=https://spectrum.chat/thread/${threadId}&t=${threadTitle}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookButton>
              <SocialIcon glyph={'facebook'} />
              <SocialButtonLabel>Share on Facebook</SocialButtonLabel>
            </FacebookButton>
          </A>
        </SocialShareWrapper>
      </NullMessagesWrapper>
    );
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

      return this.getIsAuthor()
        ? this.getAuthorEmptyMessage()
        : this.getNonAuthorEmptyMessage();
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
