// @flow
import { useState, useEffect } from 'react';

export const useAppScroller = () => {
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) setRef(document.getElementById('main'));
  });

  const scrollToTop = () => {
    const elem = ref || document.getElementById('main');
    if (elem) return elem.scrollTo(0, 0);
  };

  const scrollToBottom = () => {
    const elem = ref || document.getElementById('main');
    if (elem) return (elem.scrollTop = elem.scrollHeight - elem.clientHeight);
  };

  return { scrollToTop, scrollToBottom, ref };
};
