import { useState, useEffect } from 'react';
import { useTitle } from 'react-use';

// note: if you plan to change this you must also update the fail safe `<title>WKP · WKP UI</title>` in `index.html`
const DEFAULT_DOCUMENT_TITLE = 'WKP · WKP UI';

/**
 * Similar to react-use/useTitle, but allows for `undefined`, `null`, as well as preloading a default `WKP · WKP UI` value
 */
export const useDocumentTitle = (title?: string | null) => {
  useTitle(title ?? DEFAULT_DOCUMENT_TITLE);
};
export function useDebounce<T>(value: T, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
}
