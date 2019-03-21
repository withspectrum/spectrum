// @flow
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller-fork-mxstbr';
import { useAppScroller } from 'src/hooks/useAppScroller';

type Props = {
  loadMore: Function,
  hasMore: boolean,
  loader: React$Node,
  isReverse?: boolean,
};

/*
  Because route modals (like the thread modal) share the same scroll container 
  as all other views, we want to make sure that if a modal is open that we
  aren't performing unnecessary pagination in the background
*/
const InfiniteScroller = (props: Props) => {
  const { ref } = useAppScroller();

  return (
    <InfiniteScroll
      useWindow={false}
      initialLoad={false}
      threshold={750}
      getScrollParent={() => ref}
      {...props}
    />
  );
};

export default InfiniteScroller;
