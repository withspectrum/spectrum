// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import InfiniteList from 'src/components/infiniteScroll';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { sortAndGroupMessages } from 'shared/clients/group-messages';
import ChatMessages from 'src/components/messageGroup';
import { Loading } from 'src/components/loading';
import { Button } from 'src/components/buttons';
import Icon from 'src/components/icons';
import { NullState } from 'src/components/upsell';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import Head from 'src/components/head';
import NextPageButton from 'src/components/nextPageButton';
import { ChatWrapper, NullMessagesWrapper, NullCopy } from '../style';
import getThreadMessages from 'shared/graphql/queries/thread/getThreadMessageConnection';
import { ErrorBoundary } from 'src/components/error';
import type { GetThreadMessageConnectionType } from 'shared/graphql/queries/thread/getThreadMessageConnection';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';

type State = {
  subscription: ?Function,
};

type Props = {
  isLoading: boolean,
  location: Object,
  forceScrollToBottom: Function,
  forceScrollToTop: Function,
  contextualScrollToBottom: Function,
  id: string,
  isFetchingMore: boolean,
  loadPreviousPage: Function,
  loadNextPage: Function,
  scrollContainer: any,
  subscribeToNewMessages: Function,
  lastSeen: ?number | ?Date,
  data: { thread: GetThreadMessageConnectionType },
  thread: GetThreadType,
  currentUser: ?Object,
};

class MessagesWithData extends React.Component<Props, State> {
  state = {
    subscription: null,
  };

  componentDidUpdate(prev = {}) {
    const curr = this.props;

    if (!curr.data.thread) return;

    const previousMessagesHaveLoaded =
      prev.data.thread && !!prev.data.thread.messageConnection;
    const newMessagesHaveLoaded =
      curr.data.thread && !!curr.data.thread.messageConnection;
    const threadChanged =
      previousMessagesHaveLoaded &&
      newMessagesHaveLoaded &&
      curr.data.thread.id !== prev.data.thread.id;

    const previousMessageCount =
      previousMessagesHaveLoaded &&
      prev.data.thread.messageConnection.edges.length;
    const newMessageCount =
      newMessagesHaveLoaded && curr.data.thread.messageConnection.edges.length;
    const newMessageSent = previousMessageCount < newMessageCount;
    const messagesLoadedForFirstTime = !prev.data.thread && curr.data.thread;

    if (messagesLoadedForFirstTime && this.shouldForceScrollToBottom()) {
      setTimeout(() => curr.forceScrollToBottom());
    }

    if (threadChanged && this.shouldForceScrollToBottom()) {
      setTimeout(() => curr.forceScrollToBottom());
    }

    // force scroll to bottom when a message is sent in the same thread
    if (newMessageSent && !prev.isFetchingMore) {
      curr.contextualScrollToBottom();
    }

    // if the thread changes in the inbox we have to update the subscription
    if (threadChanged) {
      // $FlowFixMe
      this.unsubscribe()
        .then(() => this.subscribe())
        .catch(err => console.error('Error unsubscribing: ', err));
    }
  }

  componentDidMount() {
    this.subscribe();

    if (this.shouldForceScrollToBottom()) {
      return setTimeout(() => this.props.forceScrollToBottom());
    }
  }

  shouldForceScrollToBottom = () => {
    const { currentUser, data, location } = this.props;

    if (!currentUser || !data.thread) return false;

    const {
      currentUserLastSeen,
      isAuthor,
      participants,
      watercooler,
    } = data.thread;
    const isParticipant =
      participants &&
      participants.length > 0 &&
      participants.some(
        participant => participant && participant.id === currentUser.id
      );

    const isLoadingMessageFromUrlHash =
      location && location.hash && location.hash.length > 0;
    if (isLoadingMessageFromUrlHash) return false;
    return !!(currentUserLastSeen || isAuthor || isParticipant || watercooler);
  };

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
      forceScrollToBottom,
      id,
      isFetchingMore,
      loadPreviousPage,
      loadNextPage,
      scrollContainer,
      location,
      lastSeen,
      thread,
      currentUser,
    } = this.props;

    const hasMessagesToLoad = thread.messageCount > 0;
    const { channelPermissions } = thread.channel;
    const { communityPermissions } = thread.community;
    const { isLocked } = thread;
    const isChannelOwner = currentUser && channelPermissions.isOwner;
    const isCommunityOwner = currentUser && communityPermissions.isOwner;
    const isChannelModerator = currentUser && channelPermissions.isModerator;
    const isCommunityModerator =
      currentUser && communityPermissions.isModerator;
    const isModerator =
      isChannelOwner ||
      isCommunityOwner ||
      isChannelModerator ||
      isCommunityModerator;

    const messagesExist =
      data &&
      data.thread &&
      data.thread.id === id &&
      data.thread.messageConnection &&
      data.thread.messageConnection.edges.length > 0;

    if (messagesExist) {
      const { edges, pageInfo } = data.thread.messageConnection;
      const unsortedMessages = edges.map(message => message && message.node);

      const uniqueMessages = deduplicateChildren(unsortedMessages, 'id');
      const sortedMessages = sortAndGroupMessages(uniqueMessages);

      const prevCursor =
        edges && edges.length > 0 && edges[0] && edges[0].cursor;
      const lastEdge = edges && edges.length > 0 && edges[edges.length - 1];
      const nextCursor = lastEdge && lastEdge.cursor;

      return (
        <ChatWrapper>
          <ErrorBoundary>
            {pageInfo.hasPreviousPage && (
              <div>
                <NextPageButton
                  isFetchingMore={isFetchingMore}
                  fetchMore={loadPreviousPage}
                />
                <Head>
                  {prevCursor && (
                    <link
                      rel="prev"
                      href={`${location.pathname}?msgsbefore=${prevCursor}`}
                    />
                  )}
                  <link rel="canonical" href={`/thread/${data.thread.id}`} />
                </Head>
              </div>
            )}
            {pageInfo.hasNextPage && (
              <Head>
                {nextCursor && (
                  <link
                    rel="next"
                    href={`${location.pathname}?msgsafter=${nextCursor}`}
                  />
                )}
                <link rel="canonical" href={`/thread/${data.thread.id}`} />
              </Head>
            )}
            <InfiniteList
              pageStart={0}
              loadMore={loadNextPage}
              isLoadingMore={this.props.isFetchingMore}
              hasMore={pageInfo.hasNextPage}
              loader={<Loading />}
              useWindow={false}
              initialLoad={false}
              scrollElement={scrollContainer}
              threshold={750}
              className={'scroller-for-messages'}
            >
              <ChatMessages
                threadId={data.thread.id}
                thread={data.thread}
                messages={sortedMessages}
                threadType={'story'}
                forceScrollToBottom={forceScrollToBottom}
                isModerator={isModerator}
                lastSeen={lastSeen}
              />
            </InfiniteList>
          </ErrorBoundary>
        </ChatWrapper>
      );
    }

    if (isLoading && hasMessagesToLoad) {
      return (
        <ChatWrapper>
          <Loading />
        </ChatWrapper>
      );
    }

    if (!messagesExist) {
      if (isLocked) return null;
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

const map = state => ({ currentUser: state.users.currentUser });
const Messages = compose(
  // $FlowIssue
  connect(map),
  withRouter,
  getThreadMessages,
  viewNetworkHandler
)(MessagesWithData);

export default Messages;
