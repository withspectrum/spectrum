// @flow
import { useState, useEffect } from 'react';

export const useAppScroller = () => {
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) setRef(document.getElementById('scroller-for-thread-feed'));
  });

  const scrollToTop = () => {
    if (ref) return ref.scrollTo(0, 0);
  };
  const scrollToBottom = () => {
    if (ref) return (ref.scrollTop = ref.scrollHeight - ref.clientHeight);
  };

  return { scrollToTop, scrollToBottom, ref };
};
