// @flow
import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import getThreadMessages from 'shared/graphql/queries/thread/getThreadMessageConnection';
import { sortAndGroupMessages } from 'shared/clients/group-messages';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ChatMessages from 'src/components/messageGroup';
import { Loading } from 'src/components/loading';
import InfiniteScroller from 'src/components/infiniteScroll';
import NullMessages from './nullMessages';

class Messages extends React.Component<Props> {
  unsubscribe: Function;

  componentDidMount() {
    this.unsubscribe = this.props.subscribeToNewMessages();
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (
      this.props.isWatercooler &&
      prevProps.data.thread &&
      prevProps.data.thread.messageConnection.edges.length <
        this.props.data.thread.messageConnection.edges.length
    ) {
      const elem = document.getElementById('app-scroll-boundary');
      if (elem)
        return {
          top: elem.scrollTop,
          height: elem.scrollHeight,
        };
    }
    return null;
  }

  componentDidUpdate(_, __, previousScroll) {
    if (previousScroll) {
      const elem = document.getElementById('app-scroll-boundary');
      elem.scrollTop =
        elem.scrollHeight - previousScroll.height + previousScroll.top;
    }
  }

  render() {
    const {
      data,
      isLoading,
      isFetchingMore,
      hasError,
      isWatercooler,
    } = this.props;

    if (isLoading) return <Loading style={{ padding: '32px' }} />;

    const { thread } = data;
    if (!thread || hasError) return null;

    const { messageConnection } = thread;
    const { edges } = messageConnection;

    if (edges.length === 0) return <NullMessages />;

    const unsortedMessages = edges.map(message => message && message.node);
    const sortedMessages = sortAndGroupMessages(unsortedMessages);

    if (!sortedMessages || sortedMessages.length === 0) return <NullMessages />;

    const hasMore = isWatercooler
      ? messageConnection.pageInfo.hasPreviousPage
      : messageConnection.pageInfo.hasNextPage;
    const loadMore = () => {
      if (isFetchingMore) return Promise.resolve();
      if (!hasMore) return Promise.resolve();

      return isWatercooler
        ? this.props.loadPreviousPage()
        : this.props.loadNextPage();
    };

    return (
      <InfiniteScroller
        hasMore={hasMore}
        isReverse={!!isWatercooler}
        loadMore={loadMore}
        loader={<Loading key={0} />}
        threshold={250}
      >
        <ChatMessages
          thread={thread}
          uniqueMessageCount={unsortedMessages.length}
          messages={sortedMessages}
          threadType={'story'}
          isWatercooler={isWatercooler}
        />
      </InfiniteScroller>
    );
  }
}

export default compose(
  getThreadMessages,
  viewNetworkHandler
)(Messages);
