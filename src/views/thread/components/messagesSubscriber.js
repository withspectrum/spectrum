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
import { useAppScroller } from 'src/hooks/useAppScroller';

const Messages = (props: Props) => {
  const {
    subscribeToNewMessages,
    data,
    isLoading,
    isFetchingMore,
    hasError,
    isWatercooler,
  } = props;
  const { ref } = useAppScroller();

  useEffect(subscribeToNewMessages, []);

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

    return isWatercooler ? props.loadPreviousPage() : props.loadNextPage();
  };

  return (
    <InfiniteScroller
      hasMore={hasMore}
      isReverse={!!isWatercooler}
      loadMore={loadMore}
      loader={<Loading key={0} />}
      threshold={50}
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
