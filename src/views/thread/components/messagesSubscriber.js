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

const elem = document.getElementById('scroller-for-thread-feed');
const Messages = (props: Props) => {
  const {
    subscribeToNewMessages,
    data,
    isLoading,
    isFetchingMore,
    hasError,
    isWatercooler,
  } = props;

  useEffect(() => {
    const unsubscribe = subscribeToNewMessages();
    return () => Promise.resolve(unsubscribe());
  }, []);

  if (isLoading) return <Loading style={{ padding: '32px' }} />;

  const { thread } = data;
  if (!thread || hasError) return null;

  const { messageConnection } = thread;
  const { edges } = messageConnection;

  if (edges.length === 0) return <NullMessages />;

  const unsortedMessages = edges.map(message => message && message.node);
  const sortedMessages = sortAndGroupMessages(unsortedMessages);

  if (!sortedMessages || sortedMessages.length === 0) return <NullMessages />;

  const loadMore = () => {
    if (isFetchingMore) return Promise.resolve();
    if (!isWatercooler) return props.loadNextPage();

    if (!elem) return props.loadPreviousPage();

    // Preserve scroll position after load
    const previousScrollPosition = elem.scrollHeight;
    return props.loadPreviousPage().then(() => {
      elem.scrollTop =
        elem.scrollHeight - previousScrollPosition + elem.scrollTop;
    });
  };

  return (
    <InfiniteScroller
      hasMore={
        !isWatercooler
          ? messageConnection.pageInfo.hasNextPage
          : messageConnection.pageInfo.hasPreviousPage
      }
      isReverse={!!isWatercooler}
      loadMore={loadMore}
      allowPagination={true}
      loader={<Loading key={0} />}
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
};

export default compose(
  getThreadMessages,
  viewNetworkHandler
)(Messages);
