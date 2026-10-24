import { useCallback, useState } from 'react';

/**
 * Custom hook two-way data binding untuk elemen formulir.
 * @param {string} defaultValue nilai awal input.
 * @returns {[string, (eventOrValue: *) => void, (next: string) => void]}
 */
export function useInput(defaultValue = '') {
  const [value, setValue] = useState(defaultValue);

  const onValueChange = useCallback((eventOrValue) => {
    const next = eventOrValue?.target ? eventOrValue.target.value : eventOrValue;
    setValue(next);
  }, []);

  return [value, onValueChange, setValue];
}
