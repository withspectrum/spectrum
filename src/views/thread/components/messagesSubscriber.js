// @flow
import React, { useState, useEffect } from 'react';
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

  return (
    <InfiniteScroller
      hasMore={
        !isWatercooler
          ? messageConnection.pageInfo.hasNextPage
          : messageConnection.pageInfo.hasPreviousPage
      }
      isReverse={!!isWatercooler}
      loadMore={isWatercooler ? props.loadPreviousPage : props.loadNextPage}
      loader={<p>Loading...</p>}
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
