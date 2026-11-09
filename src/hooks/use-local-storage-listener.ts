import { useEffect, useRef } from 'react';

type LocalStorageCustomEvent = CustomEvent<{ key: string; value: string }>;

export function useLocalStorageChange(
  callback: (key: string, value: string) => void
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleCustomStorageChange = (event: Event) => {
      const customEvent = event as LocalStorageCustomEvent;
      callbackRef.current(customEvent.detail.key, customEvent.detail.value);
    };

    window.addEventListener('local-storage-change', handleCustomStorageChange);

    return () => {
      window.removeEventListener('local-storage-change', handleCustomStorageChange);
    };
  }, []);
}
