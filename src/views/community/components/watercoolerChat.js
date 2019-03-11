// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { ErrorBoundary } from 'src/components/error';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import getThreadMessages from 'shared/graphql/queries/thread/getThreadMessageConnection';
import { useConnectionRestored } from 'src/hooks/useConnectionRestored';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { sortAndGroupMessages } from 'shared/clients/group-messages';
import InfiniteScroll from 'react-infinite-scroller';
import ChatMessages from 'src/components/messageGroup';
import Head from 'src/components/head';
import getThreadLink from 'src/helpers/get-thread-link';
import { Loading } from 'src/components/loading';
import ChatInput from 'src/components/chatInput';
import {
  WatercoolerWrapper,
  WatercoolerMessages,
  WatercoolerChatInput,
} from '../style';

type State = {
  subscription: ?Function,
};

type Props = {
  onMessagesLoad: Function,
};

class Component extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.scrollParentRef = null;
    this.state = { subscription: null };
  }

  componentDidUpdate(prev: Props) {
    const curr = this.props;
    const { data: currData, scrollToBottom, contextualScrollToBottom } = curr;
    const { data: prevData } = prev;

    const didReconnect = useConnectionRestored({ curr, prev });
    if (didReconnect && currData.refetch) {
      currData.refetch();
    }

    const { thread: currThread } = currData;
    const { thread: prevThread } = prevData;

    if (!currThread) return;

    const previousMessagesHaveLoaded =
      prevThread && !!prevThread.messageConnection;
    const newMessagesHaveLoaded = currThread && !!currThread.messageConnection;
    const threadChanged =
      previousMessagesHaveLoaded &&
      newMessagesHaveLoaded &&
      currThread.id !== prevThread.id;

    const previousMessageCount =
      previousMessagesHaveLoaded && prevThread.messageConnection.edges.length;
    const newMessageCount =
      newMessagesHaveLoaded && currThread.messageConnection.edges.length;
    const newMessageSent = previousMessageCount < newMessageCount;
    const messagesLoadedForFirstTime = !prevThread && currThread;

    if (messagesLoadedForFirstTime || threadChanged) {
      // this.props.onMessagesLoaded(curr.data.thread);
      this.props.scrollToBottom();
    }

    if (messagesLoadedForFirstTime) {
      setTimeout(() => scrollToBottom());
    }

    if (threadChanged) {
      setTimeout(() => scrollToBottom());
    }

    // force scroll to bottom when a message is sent in the same thread
    if (newMessageSent && !prev.isFetchingMore) {
      contextualScrollToBottom();
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
    this.scrollParentRef = document.getElementById('scroller-for-thread-feed');
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

  loadPreviousPage = () => {
    return this.props.loadPreviousPage();
  };

  render() {
    const {
      id,
      scrollToBottom,
      currentUser,
      community,
      data,
      location,
    } = this.props;
    const { communityPermissions } = community;
    const { isMember, isModerator, isOwner } = communityPermissions;
    const isTeamMember = isModerator || isOwner;

    const { error, thread } = data;

    if (error) return <p>Error ...</p>;

    if (!thread) return null;

    const { messageConnection } = thread;
    const { edges, pageInfo } = messageConnection;
    const hasMessages =
      messageConnection &&
      messageConnection.edges &&
      messageConnection.edges.length > 0;

    if (!hasMessages) {
      return (
        <WatercoolerWrapper>
          <WatercoolerMessages />
          {isMember && (
            <WatercoolerChatInput>
              <ChatInput
                threadId={id}
                currentUser={currentUser}
                threadType={'directMessageThread'}
                forceScrollToBottom={scrollToBottom}
                participants={[]}
              />
            </WatercoolerChatInput>
          )}
        </WatercoolerWrapper>
      );
    }

    const unsortedMessages = edges.map(message => message && message.node);
    const uniqueMessages = deduplicateChildren(unsortedMessages, 'id');
    const sortedMessages = sortAndGroupMessages(uniqueMessages);
    const prevCursor = edges[0] && edges[0].cursor;
    const lastEdge = edges[edges.length - 1];
    const nextCursor = lastEdge && lastEdge.cursor;

    return (
      <WatercoolerWrapper>
        <WatercoolerMessages>
          <ErrorBoundary>
            {pageInfo.hasPreviousPage && (
              <React.Fragment>
                <Head>
                  {prevCursor && (
                    <link
                      rel="prev"
                      href={`${location.pathname}?msgsbefore=${prevCursor}`}
                    />
                  )}
                  <link
                    rel="canonical"
                    href={'https://spectrum.chat' + getThreadLink(thread)}
                  />
                </Head>
              </React.Fragment>
            )}
            {pageInfo.hasNextPage && (
              <Head>
                {nextCursor && (
                  <link
                    rel="next"
                    href={`${location.pathname}?msgsafter=${nextCursor}`}
                  />
                )}
                <link
                  rel="canonical"
                  href={'https://spectrum.chat' + getThreadLink(thread)}
                />
              </Head>
            )}
            <InfiniteScroll
              pageStart={0}
              isReverse
              initialLoad={false}
              loadMore={this.loadPreviousPage}
              // hasMore={pageInfo.hasPreviousPage}
              hasMore={false}
              loader={<Loading key={0} />}
              useWindow={false}
              getScrollParent={() => this.scrollParentRef}
            >
              <ChatMessages
                threadId={thread.id}
                thread={thread}
                messages={sortedMessages}
                threadType={'story'}
                isModerator={isTeamMember}
                lastSeen={new Date()}
              />
            </InfiniteScroll>
          </ErrorBoundary>
        </WatercoolerMessages>

        {isMember && (
          <WatercoolerChatInput>
            <ChatInput
              threadId={id}
              currentUser={currentUser}
              threadType={'directMessageThread'}
              forceScrollToBottom={scrollToBottom}
              participants={[]}
            />
          </WatercoolerChatInput>
        )}
      </WatercoolerWrapper>
    );
  }
}

const map = state => ({
  networkOnline: state.connectionStatus.networkOnline,
  websocketConnection: state.connectionStatus.websocketConnection,
});

export const WatercoolerChat = compose(
  getThreadMessages,
  withCurrentUser,
  withRouter,
  viewNetworkHandler,
  connect(map)
)(Component);
