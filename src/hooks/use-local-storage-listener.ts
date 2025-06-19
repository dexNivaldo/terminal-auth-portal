import { useEffect } from 'react';

type LocalStorageCustomEvent = CustomEvent<{ key: string; value: string }>;

export function useLocalStorageChange(callback: (key: string, value: string) => void) {
  useEffect(() => {
    const handleCustomStorageChange = (event: Event) => {
      const customEvent = event as LocalStorageCustomEvent;
      callback(customEvent.detail.key, customEvent.detail.value);
    };

    window.addEventListener('local-storage-change', handleCustomStorageChange);

    return () => {
      window.removeEventListener('local-storage-change', handleCustomStorageChange);
    };
  }, [callback]);
}