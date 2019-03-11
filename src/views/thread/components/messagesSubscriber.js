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

const Messages = (props: Props) => {
  const {
    subscribeToNewMessages,
    data,
    isLoading,
    isFetchingMore,
    hasError,
    isWatercooler,
  } = props;

  let ref = null;

  useEffect(() => {
    const unsubscribe = subscribeToNewMessages();
    ref = document.getElementById('scroller-for-thread-feed');
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

    if (!ref) return props.loadPreviousPage();

    // Preserve scroll position after load
    const previousScrollPosition = ref.scrollHeight;
    return props.loadPreviousPage().then(() => {
      ref.scrollTop = ref.scrollHeight - previousScrollPosition + ref.scrollTop;
    });
  };

  return (
    <InfiniteScroller
      hasMore={
        isWatercooler
          ? messageConnection.pageInfo.hasPreviousPage
          : messageConnection.pageInfo.hasNextPage
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
