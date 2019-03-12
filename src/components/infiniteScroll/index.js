// @flow
import React, { useState, useEffect } from 'react';
import InfiniteScroll from '@mxstbr/react-infinite-scroller';

type Props = {
  loadMore: Function,
  hasMore: boolean,
  loader: React$Node,
  isReverse?: boolean,
  scrollElementId?: string,
};

/*
  Because route modals (like the thread modal) share the same scroll container 
  as all other views, we want to make sure that if a modal is open that we
  aren't performing unnecessary pagination in the background
*/
const InfiniteScroller = (props: Props) => {
  const [scrollElement, setScrollElement] = useState(null);
  const { scrollElementId, ...rest } = props;

  useEffect(() => {
    setScrollElement(
      document.getElementById(scrollElementId || 'scroller-for-thread-feed')
    );
    return () => setScrollElement(null);
  }, []);

  return (
    <InfiniteScroll
      useWindow={false}
      initialLoad={false}
      threshold={750}
      getScrollParent={() => scrollElement}
      {...rest}
    />
  );
};

export default InfiniteScroller;
