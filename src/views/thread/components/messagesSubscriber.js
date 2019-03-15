// @flow
import React from 'react';
import compose from 'recompose/compose';
import getThreadMessages, {
  type GetThreadMessageConnectionType,
} from 'shared/graphql/queries/thread/getThreadMessageConnection';
import { sortAndGroupMessages } from 'shared/clients/group-messages';
import NextPageButton from 'src/components/nextPageButton';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import ChatMessages from 'src/components/messageGroup';
import { Loading } from 'src/components/loading';
import NullMessages from './nullMessages';

type Props = {
  // Used by getThreadMessages query
  isWatercooler: boolean,
  data: {
    thread: ?GetThreadMessageConnectionType,
  },
  loadPreviousPage: Function,
  loadNextPage: Function,
  subscribeToNewMessages: Function,
  onMessagesLoaded?: Function,
  ...$Exact<ViewNetworkHandlerType>,
};

class Messages extends React.Component<Props> {
  unsubscribe: Function;

  componentDidMount() {
    const thread = this.props.data.thread;
    // Scroll to bottom on mount if we got cached data as getSnapshotBeforeUpdate does not fire for mounts
    if (
      thread &&
      thread.messageConnection &&
      (thread.watercooler || thread.currentUserLastSeen)
    ) {
      const elem = document.getElementById('main');
      if (!elem) return;
      elem.scrollTop = elem.scrollHeight;
    }
    this.unsubscribe = this.props.subscribeToNewMessages();
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  getSnapshotBeforeUpdate(prev) {
    const curr = this.props;
    // First load
    if (
      !prev.data.thread &&
      curr.data.thread &&
      curr.data.thread.messageConnection.edges.length > 0 &&
      (curr.data.thread.currentUserLastSeen || curr.data.thread.watercooler)
    ) {
      return {
        type: 'bottom',
      };
    }
    // New messages
    if (
      prev.data.thread &&
      curr.data.thread &&
      prev.data.thread.messageConnection.edges.length > 0 &&
      curr.data.thread.messageConnection.edges.length > 0 &&
      prev.data.thread.messageConnection.edges.length <
        curr.data.thread.messageConnection.edges.length
    ) {
      const elem = document.getElementById('main');
      if (!elem) return null;

      // If new messages were added at the top, persist the scroll position
      if (
        prev.data.thread.messageConnection.edges[0].node.id !==
        curr.data.thread.messageConnection.edges[0].node.id
      ) {
        return {
          type: 'persist',
          values: {
            top: elem.scrollTop,
            height: elem.scrollHeight,
          },
        };
      }

      // If more than one new message was added at the bottom, stick to the current position
      if (
        prev.data.thread.messageConnection.edges.length + 1 <
        curr.data.thread.messageConnection.edges.length
      ) {
        return null;
      }

      // If only one message came in and we are near the bottom when new messages come in, stick to the bottom
      if (elem.scrollHeight < elem.scrollTop + elem.clientHeight + 400) {
        return {
          type: 'bottom',
        };
      }

      // Otherwise stick to the current position
      return null;
    }
    return null;
  }

  componentDidUpdate(prevProps, __, snapshot) {
    const { onMessagesLoaded } = this.props;
    // after the messages load, pass it back to the thread container so that
    // it can populate @ mention suggestions
    const prevData = prevProps.data;
    const currData = this.props.data;
    const wasLoading = prevData && prevData.loading;
    const hasPrevThread = prevData && prevData.thread;
    const hasCurrThread = currData && currData.thread;
    const previousMessageConnection =
      hasPrevThread && prevData.thread.messageConnection;
    const currMessageConnection =
      hasCurrThread && currData.thread.messageConnection;
    // thread loaded for the first time
    if (!hasPrevThread && hasCurrThread) {
      if (currMessageConnection.edges.length > 0) {
        onMessagesLoaded && onMessagesLoaded(currData.thread);
      }
    }
    // new messages arrived
    if (previousMessageConnection && hasCurrThread) {
      if (
        currMessageConnection.edges.length >
        previousMessageConnection.edges.length
      ) {
        onMessagesLoaded && onMessagesLoaded(currData.thread);
      }
      // already loaded the thread, but was refetched
      if (wasLoading && !currData.loading) {
        onMessagesLoaded && onMessagesLoaded(currData.thread);
      }
    }

    if (snapshot) {
      const elem = document.getElementById('main');
      if (!elem) return;
      switch (snapshot.type) {
        case 'bottom': {
          elem.scrollTop = elem.scrollHeight;
          return;
        }
        case 'persist': {
          elem.scrollTop =
            elem.scrollHeight - snapshot.values.height + snapshot.values.top;
          return;
        }
      }
    }
  }

  render() {
    const { data, isLoading, isFetchingMore, hasError } = this.props;

    if (isLoading) return <Loading style={{ padding: '32px' }} />;

    const { thread } = data;
    if (!thread || hasError) return null;

    const { messageConnection } = thread;
    const { edges } = messageConnection;

    if (edges.length === 0) return <NullMessages />;

    const unsortedMessages = edges.map(message => message && message.node);
    const sortedMessages = sortAndGroupMessages(unsortedMessages);

    if (!sortedMessages || sortedMessages.length === 0) return <NullMessages />;

    return (
      <React.Fragment>
        {messageConnection.pageInfo.hasPreviousPage && (
          <NextPageButton
            isFetchingMore={isFetchingMore}
            fetchMore={this.props.loadPreviousPage}
          >
            Load more
          </NextPageButton>
        )}
        <ChatMessages
          thread={thread}
          uniqueMessageCount={unsortedMessages.length}
          messages={sortedMessages}
          threadType={'story'}
          isWatercooler={thread.watercooler}
        />
        {messageConnection.pageInfo.hasNextPage && (
          <NextPageButton
            isFetchingMore={isFetchingMore}
            fetchMore={this.props.loadNextPage}
          >
            Load more
          </NextPageButton>
        )}
      </React.Fragment>
    );
  }
}

export default compose(
  getThreadMessages,
  viewNetworkHandler
)(Messages);
