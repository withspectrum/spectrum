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

// See https://stackoverflow.com/a/53446665
function usePrevious(value) {
  const ref = React.useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Messages = (props: Props) => {
  const {
    subscribeToNewMessages,
    data,
    isLoading,
    isFetchingMore,
    hasError,
    isWatercooler,
  } = props;
  const [ref, setRef] = React.useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToNewMessages();
    const elem = document.getElementById('scroller-for-thread-feed');
    setRef(elem);
    elem.scrollTop = elem.scrollHeight;
    return () => Promise.resolve(unsubscribe());
  }, []);

  const previousCount = usePrevious(
    props.data.thread ? props.data.thread.messageConnection.edges.length : 0
  );
  useEffect(
    () => {
      const currCount = props.data.thread
        ? props.data.thread.messageConnection.edges.length
        : 0;
      // Scroll watercooler to the bottom when messages first load
      if (isWatercooler && currCount > 0 && previousCount === 0) {
        ref.scrollTop = ref.scrollHeight;
      }
    },
    [props.data.thread && props.data.thread.messageConnection.edges.length]
  );

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
    if (!isWatercooler) return props.loadNextPage();

    if (!ref) return props.loadPreviousPage();

    // Preserve scroll position after load
    const prevScrollTop = ref.scrollTop;
    const prevHeight = ref.scrollHeight;
    return props.loadPreviousPage().then(() => {
      const currHeight = ref.scrollHeight;
      const newScrollTop = prevScrollTop + (currHeight - prevHeight);
      ref.scrollTop = newScrollTop;
    });
  };

  return (
    <InfiniteScroller
      hasMore={hasMore}
      isReverse={!!isWatercooler}
      loadMore={loadMore}
      loader={<Loading key={0} />}
      scrollElementId="main"
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
