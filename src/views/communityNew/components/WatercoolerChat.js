// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { ErrorBoundary } from 'src/components/error';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import getThreadMessages from 'shared/graphql/queries/thread/getThreadMessageConnection';
import { useConnectionRestored } from 'src/hooks/useConnectionRestored';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { sortAndGroupMessages } from 'shared/clients/group-messages';
import InfiniteList from 'src/components/infiniteScroll';
import ChatMessages from 'src/components/messageGroup';
import Head from 'src/components/head';
import NextPageButton from 'src/components/nextPageButton';
import getThreadLink from 'src/helpers/get-thread-link';
import { Loading } from 'src/components/loading';
import ChatInput from 'src/components/chatInput';
import {
  WatercoolerWrapper,
  WatercoolerMessages,
  WatercoolerChatInput,
  PreviousMessagesLoading,
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

    this.firstMessage = null;
    this.state = { subscription: null };
  }

  componentDidUpdate(prev: Props) {
    const curr = this.props;
    const {
      data: currData,
      scrollToBottom,
      contextualScrollToBottom,
      isFetchingMore,
      fetchMore,
    } = curr;
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

  paginatePreviousMessages = (isVisible: boolean) => {
    const { isFetchingMore, loadPreviousPage, scrollToPosition } = this.props;
    if (isFetchingMore || !isVisible) return;
    if (this.firstMessage) {
      const scrollPosition = this.firstMessage.offsetTop;
      scrollToPosition(scrollPosition);
    }
    return loadPreviousPage();
  };

  render() {
    console.log({ props: this.props });
    const {
      id,
      scrollToBottom,
      currentUser,
      community,
      data,
      loadPreviousPage,
      loadNextPage,
    } = this.props;
    const { communityPermissions } = community;
    const { isMember, isModerator, isOwner } = communityPermissions;
    const isTeamMember = isModerator || isOwner;

    const { isLoading, hasError, thread, isFetchingMore } = data;

    if (isLoading) return <p>Loading ...</p>;
    if (hasError) return <p>Error ...</p>;

    const isValidWatercooler = thread && thread.watercooler;

    if (!isValidWatercooler) return <p>Bad watercooler ...</p>;

    const { messageConnection } = thread;
    const { edges, pageInfo } = messageConnection;
    const hasMessages =
      messageConnection &&
      messageConnection.edges &&
      messageConnection.edges.length > 0;

    if (!hasMessages) {
      return (
        <WatercoolerWrapper>
          {isMember && (
            <WatercoolerChatInput>
              <ChatInput
                thread={id}
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
                <VisibilitySensor
                  delayedCall
                  onChange={this.paginatePreviousMessages}
                >
                  <PreviousMessagesLoading>
                    <Loading />
                  </PreviousMessagesLoading>
                </VisibilitySensor>

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
            <ChatMessages
              threadId={thread.id}
              thread={thread}
              messages={sortedMessages}
              threadType={'story'}
              isModerator={isTeamMember}
              lastSeen={new Date()}
              onRef={el => (this.firstMessage = el)}
            />
          </ErrorBoundary>
        </WatercoolerMessages>

        {isMember && (
          <WatercoolerChatInput>
            <ChatInput
              thread={id}
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
  viewNetworkHandler,
  connect(map)
)(Component);
