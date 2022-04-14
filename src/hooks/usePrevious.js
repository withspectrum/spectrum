// @flow
import { useRef, useEffect } from 'react';

function usePrevious<T>(value: T): ?T {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default usePrevious;
