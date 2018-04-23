// @flow
export const fetchMoreOnInfiniteScrollLoad = (
  scrollElement: any,
  infiniteScrollerClass: string
): boolean => {
  if (!scrollElement) return false;
  if (!window) return false;
  if (!infiniteScrollerClass) return false;

  let infiniteScroller = null;
  const nodes = document.getElementsByClassName(infiniteScrollerClass);
  if (!nodes || nodes.length === 0) return false;
  infiniteScroller = nodes[0];

  const windowHeight = window.innerHeight;

  const scrollContainerHeight = scrollElement.clientHeight;

  const infiniteScrollHeight = infiniteScroller.clientHeight;

  if (
    infiniteScrollHeight > windowHeight ||
    infiniteScrollHeight > scrollContainerHeight
  ) {
    return false;
  }

  if (scrollContainerHeight > infiniteScrollHeight) {
    return true;
  }

  return false;
};
