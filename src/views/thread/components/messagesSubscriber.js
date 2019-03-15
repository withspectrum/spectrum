// @flow
import React from 'react';
import compose from 'recompose/compose';
import getThreadMessages, {
  type GetThreadMessageConnectionType,
} from 'shared/graphql/queries/thread/getThreadMessageConnection';
import { sortAndGroupMessages } from 'shared/clients/group-messages';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import ChatMessages from 'src/components/messageGroup';
import { Loading } from 'src/components/loading';
import InfiniteScroller from 'src/components/infiniteScroll';
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
      curr.data.thread.messageConnection.edges.length > 0
    ) {
      return {
        type: 'bottom',
      };
    }
    // New messages
    if (
      prev.data.thread &&
      curr.data.thread &&
      prev.data.thread.messageConnection.edges.length <
        curr.data.thread.messageConnection.edges.length
    ) {
      const elem = document.getElementById('main');
      if (!elem) return null;

      // If we are near the bottom when new messages come in, stick to the bottom
      if (elem.scrollHeight < elem.scrollTop + elem.clientHeight + 400) {
        return {
          type: 'bottom',
        };
      }

      // If messages were added at the end, keep the scroll position the same
      if (
        prev.data.thread.messageConnection.edges[0].node.id ===
        curr.data.thread.messageConnection.edges[0].node.id
      ) {
        return null;
      }

      // If messages were added at the top, persist the scroll position
      return {
        type: 'persist',
        values: {
          top: elem.scrollTop,
          height: elem.scrollHeight,
        },
      };
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

    const hasMore = thread.watercooler
      ? messageConnection.pageInfo.hasPreviousPage
      : messageConnection.pageInfo.hasNextPage;
    const loadMore = () => {
      if (isFetchingMore) return Promise.resolve();
      if (!hasMore) return Promise.resolve();

      return thread.watercooler
        ? this.props.loadPreviousPage()
        : this.props.loadNextPage();
    };

    return (
      <InfiniteScroller
        hasMore={hasMore}
        isReverse={!!thread.watercooler}
        loadMore={loadMore}
        loader={
          <Loading
            style={{ marginBottom: '300px', marginTop: '50px' }}
            key={0}
          />
        }
        threshold={700}
      >
        <ChatMessages
          thread={thread}
          uniqueMessageCount={unsortedMessages.length}
          messages={sortedMessages}
          threadType={'story'}
          isWatercooler={thread.watercooler}
        />
      </InfiniteScroller>
    );
  }
}

export default compose(
  getThreadMessages,
  viewNetworkHandler
)(Messages);
