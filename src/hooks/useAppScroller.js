// @flow
import { useState, useEffect } from 'react';

export const useAppScroller = () => {
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) setRef(document.getElementById('app-scroll-boundary'));
  });

  const scrollToTop = () => {
    const elem = ref || document.getElementById('app-scroll-boundary');
    if (elem) return elem.scrollTo(0, 0);
  };

  const scrollToBottom = () => {
    const elem = ref || document.getElementById('app-scroll-boundary');
    if (elem) return (elem.scrollTop = elem.scrollHeight - elem.clientHeight);
  };

  return { scrollToTop, scrollToBottom, ref };
};
