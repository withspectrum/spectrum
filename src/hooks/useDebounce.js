// @flow
import { useState, useEffect } from 'react';

// @see https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}

export default useDebounce;
