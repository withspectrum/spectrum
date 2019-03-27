// @flow
import { useState, useEffect } from 'react';

export const useAppScroller = () => {
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) setRef(document.getElementById('main'));
  });

  const scrollToTop = () => {
    const elem = ref || document.getElementById('main');
    if (elem) return (elem.scrollTop = 0);
  };

  const scrollToBottom = () => {
    const elem = ref || document.getElementById('main');
    if (elem) return (elem.scrollTop = elem.scrollHeight - elem.clientHeight);
  };

  const scrollTo = (pos: number) => {
    const elem = ref || document.getElementById('main');
    if (elem) return (elem.scrollTop = pos);
  };

  return { scrollToTop, scrollTo, scrollToBottom, ref };
};
